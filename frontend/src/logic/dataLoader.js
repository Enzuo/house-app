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



