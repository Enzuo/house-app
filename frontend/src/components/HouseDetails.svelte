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

<div>
    {#if house}
    
        {house.title}
        {#if currentImage}
            <Image path={currentImage}></Image>
        {/if}
        {#if house.files}
            <ImageList on:status on:click={handleImageClick} rooms={house.files.rooms} path={house.folderPath}></ImageList>
        {/if}
    {/if}
</div>