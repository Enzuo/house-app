<script>
    import Image from "./Image.svelte"
    import { createEventDispatcher  } from "svelte"

    const dispatch = createEventDispatcher();


    export let rooms
    export let path

    function addOverHandler (room) {
        return () => {
            console.log(room.name)

            dispatch('status', {
                text: room.name
            });
        }
    }


</script>

<div class="image-list">

    {#each rooms as room}
    <div class="room" on:mouseover={addOverHandler(room)} on:focus={addOverHandler}>
        {#each room.photos as photo}
            <div class="image">
                <Image path={path + '/' + photo}/>
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
    .room:hover {
        border:1px solid #000;
    }
    .image {
        width:150px;
        height:150px;
        display: flex;
        align-items: center;
        overflow:hidden;
    }
</style>