import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "./router"

@customElement('app-')
class App extends LitElement{
    static styles = css`
    :host{
        display:block;
    }
    `;
    render(){
        //return router.get(window.location.pathname);
    }
}

//global singleton
export const app = new App;
