<script>
    // import { afterUpdate } from "svelte"
    // import { loadImage } from "../logic/dataLoader"


    export let path
    let data 

    // afterUpdate(async () => {
    //     data = await loadImage(path)
    // })
</script>

{#if data}
    <img alt="img" src="data:image/jpeg;base64,{data}"/>
{/if}

<img alt="img" src="{'api/photos/' + path}"/>


<style>
    img {
        max-height: 100%;
        max-width: 100%;
        background:#fafafa;
        margin: 0 auto;
    }
</style>