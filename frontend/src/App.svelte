<script>
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import HousePopup from './components/HousePopup.svelte'
  import HouseDetails from './components/HouseDetails.svelte'
  import { loadHouses, generateImageStructure } from './logic/dataLoader'
  import { onMount } from 'svelte'
  import * as L from "leaflet"


  let mymap
  let myhouses

  let currentHouse

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
      generateImageStructure(house.folder)
    }
  }

</script>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer"> 
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer"> 
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte + Neut</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>

  <div class="map" style="height:300px;width:300px" use:mapAction />
  <HouseDetails house={currentHouse}></HouseDetails>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
