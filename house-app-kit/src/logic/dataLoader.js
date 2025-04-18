import * as fs from 'fs/promises';
import * as path from 'path';
import Papa from 'papaparse';
import sharp from 'sharp';

import { PATH_DATA, PATH_IMG, PATH_SCHOOL_DATA, PATH_THUMBNAIL, SIZE_THUMBNAIL } from './constants'

async function loadData() {
  const dataPath = path.join(process.cwd(), PATH_DATA);
  let data = await fs.readFile(dataPath, { encoding: 'utf8' });
  // console.log(`csv file Content: ${data}`);
  return data;
}

/**
 * https://www.data.gouv.fr/fr/datasets/localisations-des-etablissements-scolaires-dans-openstreetmap/
 * 
 */
async function loadSchoolData(){
  console.log('LOAD SCHOOLS')
  const dataPath = path.join(process.cwd(), PATH_SCHOOL_DATA);
  let data = await fs.readFile(dataPath, { encoding: 'utf8' });
  let parsedData = Papa.parse(data, { header: true });

  let schools = parsedData.data.map(school => {
    // school.the_geom
    const match = school?.the_geom?.match(/POINT \((-?[\d.]+) (-?[\d.]+)\)/);
    if (match) {
      const x = parseFloat(match[1]);
      const y = parseFloat(match[2]);
      let {lon, lat} = epsg3857To4326(x, y)
      school.position = [lat, lon]
    }
    return {
      name : school.name, 
      amenity : school.amenity, 
      position : school.position,
    }
  })

  // console.log('parsed schools?', parsedData.data[0], schools[0])
  // console.log('parsed schools?', parsedData.data[48441], schools[48441])

  return schools
}
/**
 * convert EPSG:3857 (Web Mercator meters) to EPSG:4326 (WGS84 Latitude/Longitude)
 * @param {*} x 
 * @param {*} y 
 * @returns 
 */
function epsg3857To4326(x, y) {
  const R = 6378137;
  const lon = (x / R) * (180 / Math.PI);
  const lat = (Math.atan(Math.sinh(y / R)) * (180 / Math.PI));
  return { lon, lat };
}

function haversineDistance(lon1, lat1, lon2, lat2) {
  const R = 6371; // Radius of the Earth in km
  const toRad = (deg) => deg * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function findClosest(lat, lon, locations) {
  let closest = null;
  let minDistance = Infinity;

  for (var i =0; i<locations.length; i++) {
    const location = locations[i]
    if(!location || !location.position) continue
    const [ target_lat, target_lon ] = location.position;
    const distance = haversineDistance(lon, lat, target_lon, target_lat);
    
    if (distance < minDistance) {
        minDistance = distance;
        closest = { ...location, distance };
    }
  }
  
  return closest;
}

export async function loadHouses() {
  let data = await loadData();
  let parsedData = Papa.parse(data, { header: true });
  let schools = await loadSchoolData()
  let houses = parseHouseCsv(parsedData.data, schools);


  // console.log('houses', parsedData, houses);
  // .then(promiseCsvParser)
  // .then(parseHouseCsv)
  // .then((houses) => {
  //     console.log('Houses', houses)
  // })
  return houses;
}

// function promiseCsvParser(data) {
//     return new Promise(( resolve, reject) => {
//         csvParser(data, {
//             columns:true,
//           },
//           function(err, result) {
//             if(err){
//                 return reject(err)
//             }
//             resolve(result)
//           }
//         )
//     })
// }

function parseHouseCsv(csvHouses, schools) {
  let houses = [];

  for (var i = 0; i < csvHouses.length; i++) {
    let csvHouse = csvHouses[i];
    let house = {};
    house.position = csvHouse['Position'].split(',').map((a) => parseFloat(a));
    house.title = csvHouse['Title'];
    house.city = csvHouse['Ville'];
    house.price = csvHouse['Price'];
    house.surface = csvHouse['Surface'];
    house.surfaceTotal = csvHouse['Surface Terrain'];
    house.options = csvHouse['Options'].split(',');
    house.folder = csvHouse['Folder'];
    house.link = csvHouse['Lien'];
    house.history = csvHouse['Historique'];

    house.isVisited = csvHouse['Visite'] && csvHouse['Visite'].length > 0 && csvHouse['Visite'] !== 'Non' ? true : false

    house.observations = csvHouse['Observations']
    house.isRejected = csvHouse['Observations'].match(/^ *NO/i);
    house.isSelected = csvHouse['Observations'].match(/^ *Y/i);

    if(house.position && schools){
      let school = findClosest(house.position[0], house.position[1], schools)
      // let school
      // console.log(house.folder, house.position, school)
      house.school = school
    }

    // scan files :
    //   if(house.folder){
    //     let files = fs.readdirSync(path.join(FILEPATH, house.folder))

    //     let floors = []
    //     let photoFiles = files.reduce((acc, f) => {
    //       if(f.indexOf('floor') >= 0){
    //         floors.push(f)
    //       }
    //       else{
    //         acc.push(f)
    //       }
    //       return acc
    //     }, [])

    //     let rooms = extractRoomsFromFiles(photoFiles)
    //     house.rooms = rooms

    //     house.photos = photoFiles
    //     // house.floors = ['floor1.svg','floor2.svg']
    //     house.floors = floors
    //   }

    houses.push(house);
  }

  return houses;
}

export async function generateImageStructure(folder = './', houses) {
  folder = PATH_IMG
  let mainDirectory = await fs.readdir(folder, {withFileTypes: true});
  
  
  let thumbImage

  // thumbnails directory
  ensureDirectory(PATH_THUMBNAIL)


  for (var i = 0; i < mainDirectory.length; i++) {
    let entry = mainDirectory[i];

    if (entry.isDirectory()) {
      // console.log('lets parse', folder + entry.name);
      // let subDirectory = await fs.readdir(folder + entry.name);
      // console.log('sub', subDirectory);
      let house = houses.find((house) => house.folder === entry.name)

      if(house){
        let folderPath = folder + entry.name;
        let result = await parseImagesFolder(folderPath);
        house.folderPath = entry.name;
        house.files = result;

        thumbImage = house.files.photoFiles[0]
        generateThumbnail(house.folderPath, thumbImage)
      }
    }
  }
  // console.log('houses with files', houses);
  return houses;
}


async function ensureDirectory(dirPath) {
  try {
    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) {
      throw new Error(`${dirPath} exists but is not a directory`);
    }
    console.log('Directory already exists:', dirPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Directory does not exist
      await fs.mkdir(dirPath, { recursive: true });
      console.log('Directory created:', dirPath);
    } else {
      throw err; // Some other error, rethrow it
    }
  }
}


async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false; // File doesn't exist
    }
    throw err; // Some other error occurred
  }
}

/**
 * 
 * @param {string} filePath 
 * @param {string} imageFile 
 */
async function generateThumbnail(filePath, imageFile){
  console.log('generate thumbnail', filePath, imageFile)

  let outputPath = path.join(PATH_THUMBNAIL, filePath + '_' + imageFile)
  let isThumbnailAlreadyGenerated = await fileExists(outputPath)
  if(isThumbnailAlreadyGenerated){
    console.log('already generated')
    return
  }
  
  let inputPath = path.join(PATH_IMG, filePath, imageFile)
  try {
    await sharp(inputPath)
    .resize(...SIZE_THUMBNAIL)
    .jpeg({ quality: 70 })
    .toFile(outputPath);
  }
  catch(e){
    console.log('Error on generating thumbnail', filePath, imageFile)
  }
}

async function parseImagesFolder(folder) {
  // console.log('parse Images Folder', folder);
  let files = await fs.readdir(folder);

  let floors = [];
  let photoFiles = files.reduce((acc, fileName, index) => {
    if(fileName === '.DS_Store'){
      return acc
    }
    // if (index < 2) {
    //   return acc;
    // }
    if (fileName.indexOf('floor') >= 0) {
      floors.push(fileName);
    } else {
      acc.push(fileName);
    }
    return acc;
  }, []);

  // console.log('photoFiles', photoFiles);

  let rooms = extractRoomsFromFiles(photoFiles);
  return { rooms, photoFiles, floors };
}

function addRoomPhoto(rooms, roomName, fileName) {
  let room = rooms.find((r) => r.name === roomName);
  if (room) {
    room.photos.push(fileName);
  } else {
    rooms.push({ name: roomName, photos: [fileName] });
  }
}

/**
 *
 * @param {string[]} photoFiles
 */
function extractRoomsFromFiles(photoFiles) {
  // extract rooms from photo files
  let rooms = photoFiles.reduce((acc, fileName) => {
    let photoName = fileName.match(/\w+/)[0];

    let underscore = photoName.match(/_/);
    if (underscore) {
      let roomName = photoName.split('_')[0];
      addRoomPhoto(acc, roomName, fileName);
    } else {
      let numbers = photoName.match(/\d+/);
      if (numbers) {
        let roomName = photoName.split(/\d+/)[0];
        addRoomPhoto(acc, roomName, fileName);
      } else {
        addRoomPhoto(acc, photoName, fileName);
      }
    }
    return acc;
  }, []);
  return rooms;
}

/* -------------------------
 * IMAGE Loader
 ------------------------- */
// TODO add cache
// TODO load one by one
// let loaderQueue = [];
// const cache = {};

// export async function loadImage(path) {
//   return new Promise((resolve, reject) => {
//     if (cache[path]) {
//       resolve(cache[path]);
//       return;
//     }
//     let callback = (data) => {
//       cache[path] = data;
//       resolve(data);
//     };
//     loaderQueue.push({ path, callback });
//     startLoader();
//   });
// }

// let isLoaderRunning = false;
// function startLoader() {
//   if (!isLoaderRunning) {
//     isLoaderRunning = true;
//     loaderWork();
//   }
// }

// async function loaderWork() {
//   let work = loaderQueue.shift();
//   console.log('loader work', work);
//   if (!work) {
//     isLoaderRunning = false;
//     return;
//   }
//   let data = await Neutralino.filesystem.readBinaryFile(work.path);
//   let base64data = _arrayBufferToBase64(data);
//   work.callback(base64data);
//   loaderWork();
// }

// function _arrayBufferToBase64(buffer) {
//   var binary = '';
//   var bytes = new Uint8Array(buffer);
//   var len = bytes.byteLength;
//   for (var i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// }
