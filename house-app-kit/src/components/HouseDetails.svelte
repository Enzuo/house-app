<script>
    import Image from "./Image.svelte"
    import ImageList from "./ImageList.svelte"


    export let house

    let currentImage
    
    // Reset state on house change
    $ : {
        console.log('setting image', house)
        if(house) {
            currentImage = null

            if(house.files && house.files.photoFiles) {
                console.log(house.files.photoFiles)
                currentImage = house.folderPath + '/' + house.files.photoFiles[0]
            }
        }
    }

    function handleImageClick (e) {
        currentImage = e.detail.imagePath
    }
</script>

<div class="panel">
    {#if house}
        <div class="main-content">
            <div class="content-wrapper">
                <div class="title">
                    <h1>
                        {house.title} 
                    </h1>
                    <div>
                        {house.id + 2} - {house.city}
                    </div>
                </div>
                <a target="_blank" href={'https://www.google.com/maps/place/' + house.position[0] + ',' + house.position[1]}>Google map</a>
                <a target="_blank" href={"https://www.geoportail.gouv.fr/carte?c="+ house.position[1] + ',' + house.position[0] + "&z=19&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=CADASTRALPARCELS.HISTO.2008-2013.PARCELS::GEOPORTAIL:OGC:WMTS(0.7;h)&l2=PCRS.LAMB93::GEOPORTAIL:OGC:WMTS(1;h)&l3=CADASTRALPARCELS.PARCELLAIRE_EXPRESS::GEOPORTAIL:OGC:WMTS(1)&permalink=yes"}>GeoPortail</a>
                <a target="_blank" href={"https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous&code=79116000AK&level=section&lat="+house.position[0]+"&lng="+house.position[1]+"&zoom=16"}>DVF</a>
                {#if house.link}
                {#each house.link.split(/\n|;/) as link}
                    <a target="_blank" href={link}>Lien annonce</a>
                {/each}
                {/if}


                <div>
                    Prix : {house.price} 
                </div>
                <div>
                    Surface : {house.surface} m²
                </div>
                <div>
                    Surface terrain : {house.surfaceTotal} m²
                </div>
                {#if house.history && house.history.length > 0}
                <div>
                    History : {house.history}
                </div>
                {/if}
                {#if house.observations && house.observations.length > 0}
                <div>
                    Observations : {house.observations}
                </div>
                {/if}
                {#if house.school}
                <div>
                    Closest school : {house.school.distance.toFixed(2)} km - {house.school.name}
                </div>
                {/if}
                {#if house.trainStation}
                <div>
                    Closest train station : {house.trainStation.distance.toFixed(2)} km - {house.trainStation.name}
                </div>
                {/if}

                {#if currentImage}
                <div class="image-wrapper">
                    <Image path={currentImage}></Image>
                </div>
                {/if}
            </div>
        </div>
        {#if house.files}
        <div class="footer">
            <ImageList on:status on:click={handleImageClick} rooms={house.files.rooms} path={house.folderPath}></ImageList>
        </div>
        {/if}
    {/if}
</div>

<style>
    .panel {
        display:flex;
        flex-direction: column;
        height:100%;
    }
    .main-content {
        flex-grow:1;
        overflow:hidden;
        display:flex;
        flex-direction:column;
        /* align-items: center; */
    }
    .content-wrapper {
        max-width: 100%;
        max-height: 100%;
    }
    .image-wrapper {
        display:flex;
        height: 100%;
    }
    .footer {
        margin-bottom: 25px;
    }
    h1 {
        margin-bottom: 0px;
    }
    .title {
        margin-bottom: 20px;
    }
    a {
        margin-right:10px;
    }
</style>