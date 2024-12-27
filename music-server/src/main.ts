import {ELEM, CSS} from "htmlgen";

const changePath = function(path: string){
    const {location} = window;
    window.history.replaceState(null,"",location.origin+path);
}

class LoginModal{
    constructor(){
        super("div")`
        backgroundColor: 
        `;
    }
    open(){
        this.display = "block";
    }
    close(){
        this.display = "none";
    }
}

class App extends ELEM{
    constructor(){
        super("div");
        this.loginModal = this.add(new LoginModal);
    }
    goto(path: string){
        changePath(path);
    }
    openLogin(){
    }
}


console.log(1);
