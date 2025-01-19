<script>
    import Image from "./Image.svelte"
    import { createEventDispatcher  } from "svelte"

    const dispatch = createEventDispatcher();


    export let rooms
    export let path

    function addOverHandler (room) {
        return () => {
            dispatch('status', {
                text: room.name
            });
        }
    }

    function addClickHandler (imagePath) {
        return () => {
            dispatch('click', {
                imagePath
            })
        }
    }


</script>

<div class="image-list">

    {#each rooms as room}
    <div class="room" on:mouseover={addOverHandler(room)} on:focus={addOverHandler}>
        {#each room.photos as photo}
            <div class="image" on:click={addClickHandler(path + '/' + photo)} on:keydown={addClickHandler(path + '/' + photo)}>
                {#key path + '/' + photo}
                    <Image path={path + '/' + photo}/>
                {/key}
            </div>
        {/each}
    </div>
    {/each}
</div>

<style>
    .image-list {
        display:flex;
        width:100%;
        overflow-x: scroll;
    }
    .room {
        display:flex;
    }
    .room:hover {
        border:1px solid #000;
    }
    .image {
        width:125px;
        height:125px;
        display: flex;
        align-items: center;
        overflow:hidden;
    }
</style>