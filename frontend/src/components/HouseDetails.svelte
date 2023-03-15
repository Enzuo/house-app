<script>
    export let house
</script>

<div>

    House Detail component
    {#if house}
    
    House {house.title}
    
    {/if}
</div>