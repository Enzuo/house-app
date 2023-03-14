import './app.css'
import App from './App.svelte'
import * as Neutralino from "@neutralinojs/lib"


function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);


const app = new App({
  target: document.getElementById('app'),
})



export default app
