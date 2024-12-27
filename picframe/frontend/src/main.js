import {ELEM} from "htmlgen";
import {api} from "./api.js"

const pathmap = {
    "gallery": Login,
    "view": Main,
    "": Main
};


class App extends ELEM{
    constructor(){
        super("div");
    }
    async init(){
        // login widget
        const path = window.location.pathname.split("/");
        if(){
        }
    }
}

