<script>
    /** @type {number} */
    export let maxPrice;
    /** @type {number} */
    export let schoolDistance;
    /** @type {number} */
    export let trainStationDistance;
</script>

<div class="filter-bar">
<label for="price">Max Price:</label>
<input
    id="price"
    type="number"
    min="0"
    bind:value={maxPrice}
/>
<label for="price">School distance:</label>
<input
    id="price"
    type="number"
    min="0"
    bind:value={schoolDistance}
/>
<label for="price">TrainStation distance:</label>
<input
    id="price"
    type="number"
    min="0"
    bind:value={trainStationDistance}
/>
</div>

<style>
.filter-bar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 1rem;
    border: 1px solid #ccc;
}
</style>