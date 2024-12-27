import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('app-')
class App extends LitElement{
    static styles = css`
    :host{
        display:block;
    }
    `;
}

//global singleton
export const app = new App;
