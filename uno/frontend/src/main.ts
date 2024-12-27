import {ELEM,CSS} from "htmlgen";


class WelcomePage extends ELEM{
    static async createComponent(baseElem: HTMLElement){
        const comp = new WelcomePage;
        comp.e = baseElem;
        await comp.init();
        return comp;
    }
    async init(){
        this.add("h1").setInner("Uno party");
        const top = this.add("div");
        top.add("h2")..setInner("Select a room");
        const e_rooms = top.add("div");
        const bot = this.add("div");
        bot.add("h2").setInner("Or create a new room");
        
    }
    async destroyComponent(){
        for(let child of this.children){
            child.remove();
        }
    }
}


class App extends ELEM{
    static async createComponent(baseElem: HTMLElement){
        const app = new App;
        app.e = baseElem;
        await app.init();
        return app;
    }
    async init(){
        this.mount(new WelcomePage)
    }
}

App.createApp(document.querySelector("#app"));


