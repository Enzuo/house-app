import * as Neutralino from "@neutralinojs/lib"
import Papa from "papaparse"

async function loadData () {
    let data = await Neutralino.filesystem.readFile('./houses.csv')
    console.log(`csv file Content: ${data}`)
    return data
}

export async function loadHouses() {
    let data = await loadData()
    let parsedData = Papa.parse(data, {header : true})
    let houses = parseHouseCsv(parsedData.data)

    console.log("houses", parsedData, houses)
    // .then(promiseCsvParser)
    // .then(parseHouseCsv)
    // .then((houses) => {
    //     console.log('Houses', houses)
    // })
    return houses
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
    let houses = []
  
    for(var i=0; i<csvHouses.length; i++){
      let csvHouse = csvHouses[i]
      let house = {}
      house.position = csvHouse['Position'].split(',').map(a => parseFloat(a))
      house.title = csvHouse['Title']
      house.price = csvHouse['Price']
      house.surface = csvHouse['Surface']
      house.surfaceTotal = csvHouse['Surface Terrain']
      house.options = csvHouse['Options'].split(',')
      house.folder = csvHouse['Folder']
    
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
  
      houses.push(house)
    }

    return houses
}



export async function generateImageStructure (folder = "./", houses) {

  let mainDirectory = await Neutralino.filesystem.readDirectory(folder);
  for(var i=2; i < mainDirectory.length; i++){
    let entry = mainDirectory[i]

    if(entry.type === 'DIRECTORY'){
      let subDirectory = await Neutralino.filesystem.readDirectory(folder+entry.entry);
      for(var j=2; j<subDirectory.length; j++){

        for(var k=0; k< houses.length; k++){
          let house = houses[k]
          if(subDirectory[j].entry === house.folder){
            let folderPath = folder + entry.entry + "/" + house.folder
            let result = await parseImagesFolder(folderPath)
            house.folderPath = folderPath
            house.files = result
          }
        }
      }
    }
  }
  console.log('houses with files', houses)
  return houses
}

async function parseImagesFolder (folder) {
  let files = await Neutralino.filesystem.readDirectory(folder)
      
  let floors = []
  let photoFiles = files.reduce((acc, f, index) => {
    if(index < 2 ){
      return acc
    }
    if(f.entry.indexOf('floor') >= 0){
      floors.push(f.entry)
    }
    else{
      acc.push(f.entry)
    }
    return acc
  }, [])

  console.log("photoFiles", photoFiles)

  let rooms = extractRoomsFromFiles(photoFiles)
  return {rooms, photoFiles, floors}
}




function addRoomPhoto(rooms, roomName, fileName){
  let room = rooms.find(r => r.name === roomName)
  if(room){
    room.photos.push(fileName)
  }
  else {
    rooms.push({name : roomName, photos : [fileName]})
  }
}

/**
 * 
 * @param {string[]} photoFiles 
 */
function extractRoomsFromFiles(photoFiles){
  // extract rooms from photo files 
  let rooms = 
  photoFiles.reduce((acc, fileName) => {
    let photoName = fileName.match(/\w+/)[0]

    let underscore = photoName.match(/_/)
    if(underscore){
      let roomName = photoName.split('_')[0]
      addRoomPhoto(acc, roomName, fileName)
    }
    else {
      let numbers = photoName.match(/\d+/)
      if(numbers){
        let roomName = photoName.split(/\d+/)[0]
        addRoomPhoto(acc, roomName, fileName)
      }
      else{
        addRoomPhoto(acc, photoName, fileName)
      }
    }
    return acc
  }, [])
  return rooms
}

// TODO add cache
// TODO load one by one
export async function loadImage(path){
  console.log("load", path)
  let data
  try {
    data = await Neutralino.filesystem.readBinaryFile(path)
  }
  catch(e) {
    console.error(e)
  }
  console.log("image data" , data)
  return _arrayBufferToBase64(data)
}

function _arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}