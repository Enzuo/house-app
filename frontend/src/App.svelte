<script>
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import HousePopup from './components/HousePopup.svelte'
  import HouseDetails from './components/HouseDetails.svelte'
  import StatusBar from './components/StatusBar.svelte'
  import { loadHouses, generateImageStructure } from './logic/dataLoader'
  import { onMount } from 'svelte'
  import * as L from "leaflet"


  let mymap
  let myhouses

  let currentHouse

  let status = ""

  // async function loadData () {
  //   console.log('load data')
  //   let data
  //   try {
  //     data = await Neutralino.filesystem.readFile('./houses.csv')
  //     console.log('called neutralino')
  //   }
  //   catch (e) {
  //     console.log('error', e)
  //   }
  //   console.log(`Content: ${data}`)
  //   return data
  // }

  // breaking reactivity ? TODO investigate
  // $: displayHouses(mymap, myhouses) 

  onMount(async () => {
    myhouses = await loadHouses()
    generateImageStructure("./", myhouses)
    displayHouses(mymap, myhouses) 
	});

  function mapAction(element){
    mymap = L.map(element, {preferCanvas: true }).setView([46.33, -1.31], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap)

    return mymap
  }

  function displayHouses(map, houses) {
    console.log("displayHouses")
    if(!houses) return
    if(!map) return
    for(var i=0; i<houses.length; i++){
      var house = houses[i]
      var marker = L.marker(house.position).addTo(map)
      marker.bindPopup(generatePopupHandler(house))
      marker.on('click', generateClickHandler(house));
    } 
  }

  function generatePopupHandler(house){
    return () => {
      let container = L.DomUtil.create('div');
      let c = new HousePopup({
        target: container,
        props: {
          house
        }
      });
      return container
    }
  }

  function generateClickHandler(house){
    return () => {
      console.log("house click")
      currentHouse = house
    }
  }

</script>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

<main>
  <div class="map" style="height:300px;width:300px" use:mapAction />
  <HouseDetails on:status={(e) => status = e.detail.text} house={currentHouse}></HouseDetails>
  <StatusBar text={status}></StatusBar>
</main>

<style>

</style>
