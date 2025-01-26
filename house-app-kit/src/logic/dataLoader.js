import * as fs from 'fs/promises';
import * as path from 'path';
import Papa from 'papaparse';


const PATH_DATA = '../houses.csv';
const PATH_IMG = '/Users/enzo/Library/CloudStorage/OneDrive-Personal/Maison/photos/';

async function loadData() {
  const dataPath = path.join(process.cwd(), PATH_DATA);
  let data = await fs.readFile(dataPath, { encoding: 'utf8' });
  // console.log(`csv file Content: ${data}`);
  return data;
}

export async function loadHouses() {
  let data = await loadData();
  let parsedData = Papa.parse(data, { header: true });
  let houses = parseHouseCsv(parsedData.data);

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

function parseHouseCsv(csvHouses) {
  let houses = [];

  for (var i = 0; i < csvHouses.length; i++) {
    let csvHouse = csvHouses[i];
    let house = {};
    house.position = csvHouse['Position'].split(',').map((a) => parseFloat(a));
    house.title = csvHouse['Title'];
    house.price = csvHouse['Price'];
    house.surface = csvHouse['Surface'];
    house.surfaceTotal = csvHouse['Surface Terrain'];
    house.options = csvHouse['Options'].split(',');
    house.folder = csvHouse['Folder'];

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
  for (var i = 0; i < mainDirectory.length; i++) {
    let entry = mainDirectory[i];

    if (entry.isDirectory()) {
      console.log('lets parse', folder + entry.name);
      // let subDirectory = await fs.readdir(folder + entry.name);
      // console.log('sub', subDirectory);
      let house = houses.find((house) => house.folder === entry.name)

      if(house){
        let folderPath = folder + entry.name;
        let result = await parseImagesFolder(folderPath);
        house.folderPath = entry.name;
        house.files = result;
      }
    }
  }
  console.log('houses with files', houses);
  return houses;
}

async function parseImagesFolder(folder) {
  console.log('parse Images Folder', folder);
  let files = await fs.readdir(folder);

  let floors = [];
  let photoFiles = files.reduce((acc, fileName, index) => {
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

  console.log('photoFiles', photoFiles);

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
