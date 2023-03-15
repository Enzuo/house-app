<script>
    import Image from "./Image.svelte"
    import ImageList from "./ImageList.svelte"


    export let house
</script>

<div>

    House Detail component
    {#if house}
    
        House {house.title}
        {#if house.files}
            <ImageList on:status rooms={house.files.rooms} path={house.folderPath}></ImageList>
        {/if}
    {/if}
</div>