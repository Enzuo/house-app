<script>
    import Image from "./Image.svelte"
    import { createEventDispatcher  } from "svelte"

    const dispatch = createEventDispatcher();

    let { rooms, path, onImageChange } = $props();

    let nbImages = $derived(
        rooms.reduce((total, room) => total += room.photos.length, 0)
    )

    let currentImageIndex = $state(0)
    $effect(() => {
        if(path){
            currentImageIndex = 0; // Reset state when path changes
        }
    });

    let roomsComputed = $derived.by(() => {
        console.log('compute roomsComputed')
        let index = 0
        return rooms.map((r) => {
            let photos = r.photos.map((photo) => {
                return { index : index++, path : photo}
            })
            return {...r, photos}
        })
    })

    // export let rooms
    // export let path

    function addOverHandler (room) {
        return () => {
            dispatch('status', {
                text: room.name
            });
        }
    }

    function addClickHandler (imagePath, index) {
        console.log(index)
        return () => {
            dispatch('click', {
                imagePath
            })
        }
    }

    function on_key_down(event){
        if (event.repeat) return;

        console.log(event.key)
        // onImageChange()

        switch (event.key) {
            case "ArrowRight":        
                currentImageIndex++
                break
            case "ArrowLeft":
                currentImageIndex--
                break
        }

        if(currentImageIndex < 0 ){
            currentImageIndex = nbImages - 1;
        }
        if(currentImageIndex >= nbImages){
            currentImageIndex = 0;
        }

        let imageFound = findImageByIndex(currentImageIndex)
        if(!imageFound) { 
            return
        }

        dispatch('click', {
            imagePath : path + '/' + imageFound.path
        })
    }

    function on_key_up(e){

    }

    function findImageByIndex(index){
        for (var i=0; i < roomsComputed.length; i++) {
            let r = roomsComputed[i]
            for(var j=0; j < r.photos.length; j++) {
                let p = r.photos[j]
                if(p.index === index){
                    console.log('findImageByIndex', p)
                    return p
                }
            }
        }
    }


</script>

<svelte:window
    on:keydown={on_key_down}
    on:keyup={on_key_up}
/>

<div class="image-list">
    {#if roomsComputed}
        { console.log(roomsComputed) }
        {#each roomsComputed as room}
        <div class="room" on:mouseover={addOverHandler(room)} on:focus={addOverHandler}>
            {#each room.photos as photo}
                <div class="image" on:click={addClickHandler(path + '/' + photo.path, photo.index)} on:keydown={addClickHandler(path + '/' + photo.path, photo.index)}>
                    {#key photo.index}
                        <Image path={path + '/' + photo.path}/>
                    {/key}
                </div>
            {/each}
        </div>
        {/each}
    {/if}
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