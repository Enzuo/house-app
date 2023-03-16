<script>
    import Image from "./Image.svelte"
    import ImageList from "./ImageList.svelte"


    export let house

    let currentImage
    
    // Reset state on house change
    $ : {
        if(house) currentImage = null
    }

    function handleImageClick (e) {
        currentImage = e.detail.imagePath
    }
</script>

<div class="panel">
    {#if house}
        <div class="main-content">
            <h1>
                {house.title}
            </h1>
            
            {#if currentImage}
            <div class="">
                <Image path={currentImage}></Image>
            </div>
            {:else}
            <div>
                Prix : {house.price} 
            </div>
            <div>
                Surface : {house.surface} m²
            </div>
            <div>
                Surface terrain : {house.surfaceTotal} m²
            </div>
            <div>
                Dossier images : {house.folderPath} - {house.folder}
            </div>
            {/if}
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
</style>