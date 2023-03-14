import './app.css'
import App from './App.svelte'
import Neutralino from "@neutralinojs/lib"


const app = new App({
  target: document.getElementById('app'),
})

function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);

export default app
