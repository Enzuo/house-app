<script>
    import Image from "./Image.svelte";


    export let house
</script>

<div>

    House Detail component
    {#if house}
    
    House {house.title}

    {#each house.files.photoFiles as image}
        <Image path={house.folderPath + '/' + image}/>
    {/each}
    
    {/if}
</div>