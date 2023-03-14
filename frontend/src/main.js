import './app.css'
import App from './App.svelte'
import Neutralino from "@neutralinojs/lib"


const app = new App({
  target: document.getElementById('app'),
})

Neutralino.init()

export default app
