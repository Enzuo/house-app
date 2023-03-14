import csvParser from './node_modules/csv-parse/lib/index.js'


let getUsername = async () => {
    const key = NL_OS == 'Windows' ? 'USERNAME' : 'USER';
    let value = '';
    try {
        value = await Neutralino.os.getEnv(key);
    }
    catch (err) {
        console.error(err);
    }
    document.getElementById('name').innerText = `Hello ${value}`;
}

function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);
getUsername();





// ---------------
// Map
// ---------------

var mymap = L.map('map').setView([46.31, -0.99], 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap)


// data



async function loadData () {
    let data = await Neutralino.filesystem.readFile('./houses.csv')
    console.log(`Content: ${data}`)
    return data
}

loadData()
.then(promiseParser)
.then(parseHouseCsv)
.then((houses) => {
    console.log('houses', houses)
})


function promiseParser(data) {
    return new Promise(( resolve, reject) => {
        csvParser(data, {
            columns:true,
          },
          function(err, result) {
            if(err){
                return reject(err)
            }
            resolve(result)
          }
        )
    })
}


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
















// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library

// function showInfo() {
//     document.getElementById('info').innerHTML = `
//         ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
//         <br/><br/>
//         <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
//         `;
// }

// function openDocs() {
//     Neutralino.os.open("https://neutralino.js.org/docs");
// }

// function openTutorial() {
//     Neutralino.os.open("https://www.youtube.com/watch?v=txDlNNsgSh8&list=PLvTbqpiPhQRb2xNQlwMs0uVV0IN8N-pKj");
// }

// function setTray() {
//     if(NL_MODE != "window") {
//         console.log("INFO: Tray menu is only available in the window mode.");
//         return;
//     }
//     let tray = {
//         icon: "/resources/icons/trayIcon.png",
//         menuItems: [
//             {id: "VERSION", text: "Get version"},
//             {id: "SEP", text: "-"},
//             {id: "QUIT", text: "Quit"}
//         ]
//     };
//     Neutralino.os.setTray(tray);
// }

// function onTrayMenuItemClicked(event) {
//     switch(event.detail.id) {
//         case "VERSION":
//             Neutralino.os.showMessageBox("Version information",
//                 `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
//             break;
//         case "QUIT":
//             Neutralino.app.exit();
//             break;
//     }
// }

// function onWindowClose() {
//     Neutralino.app.exit();
// }

// Neutralino.init();

// Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
// Neutralino.events.on("windowClose", onWindowClose);

// if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
//     setTray();
// }

// showInfo();
