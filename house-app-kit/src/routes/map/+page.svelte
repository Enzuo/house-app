<script>
    import HousePopup from '../../components/HousePopup.svelte'
    import HouseDetails from '../../components/HouseDetails.svelte'
    import StatusBar from '../../components/StatusBar.svelte'
    import { onMount, mount } from 'svelte'
    import * as L from "leaflet"
  
  
    let mymap = $state()
    let myhouses
  
    let currentHouse = $state()
  
    let status = $state("")

    let { data } = $props();

    $effect(() => {
        console.log('svelte effect', data)
        if (data && mymap) {
            console.log('rendering data on map')
            console.log('Data has been loaded:', data);
            displayHouses(mymap, data.houses) 
        }
    })

  
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
      status = "loading..."
      initMap()
      status = "Ok"
    });
  
    function initMap(){
      mymap = L.map('map', {preferCanvas: true }).setView([46.82, -0.139], 8)
  
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
        console.log("pos", house.position, house)
        if(!house.position[0]) continue // House data with no position, TODO might want to throw an error here

        var icon = null
        if(house.files && house.files.photoFiles && house.files.photoFiles[0]) {
            var iconPath = 'api/photos/' + house.folderPath + '/' + house.files.photoFiles[0]
            var iconClass = house.position[0].toString().length > 5 ? 'precise' : ''
            iconClass = house.isVisited ? 'visited' : iconClass
            icon = L.icon({
                iconUrl: iconPath,
                iconSize: [32, 32],
                className: iconClass,
            });
        }

        var marker
        if(icon){
            marker = L.marker(house.position, {icon}).addTo(map) 
        }
        else {
            marker = L.marker(house.position).addTo(map) 
        }
        marker.bindPopup(generatePopupHandler(house))
        marker.on('click', generateClickHandler(house))
        marker.on('mouseover', generateOverHandler(house))
      } 
    }
  
    function generatePopupHandler(house){
      return () => {
        let container = L.DomUtil.create('div');
        let c = mount(HousePopup, {
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
  
    function generateOverHandler(house){
      return () => {
        console.log('over')
        status = house.title + " / " + house.price + " / " + house.surface + " m²"
      }
    }
  
  </script>
  
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
     integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
     crossorigin=""/>
  
  <main>
    <div class="content">
      <div class="map-panel">
        <div id="map" style="height:100vh;width:700px" />
      </div>
      <div class="detail-panel">
        <HouseDetails on:status={(e) => status = e.detail.text} house={currentHouse}></HouseDetails>
      </div>
    </div>
    <div class="footer">
      <StatusBar text={status}></StatusBar>
    </div>
  </main>
  
  <style>
    main {
      min-height:100vh; 
      display:flex;
      flex-direction:column;
    }
    .content {
      flex-grow:1;
      max-height:100vh;
      display:flex;
    }
    .detail-panel {
      overflow: hidden;
      flex-grow: 1;
    }
    .footer {
      position: fixed;
      z-index: 1000;
      bottom: 0;
      width: 100vw;
      background: white;
      border-top: 1px solid lightgrey;
      padding: 2px 5px 5px 5px;
    }
  </style>
  