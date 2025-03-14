<script>
    let { label, checked = $bindable() } = $props();

    
    const toggle = () => {
      checked = !checked;
    };
  </script>
  
  <button
    on:click={toggle}
    aria-pressed={checked}
    class="toggle-button {checked ? 'active' : ''}"
  >
    {label}
  </button>
  
  <style>
    .toggle-button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      /* border: 2px solid #444; */
      /* background-color: white; */
      color: #444;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;
      /* border-radius: 5px; */
      border:none;
      background:none;
    }
    
    .toggle-button.active {
      /* background-color: #444; */
      /* color: white; */
      color:deepskyblue;
    }
  </style>
  