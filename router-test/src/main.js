import {ELEM, CSS} from "htmlgen";
import {get, post, addBus} from "./util.js";
import {createQuiz} from "./quizService.js";


const normalizePath = function(path){
    path += "/";
    let res = "";
    for(let i = 0; i < path.length; i++){
        let c = path[i];
        if(c === "/"){
            if(path[i-1] === "/")continue;
            res += "/";
        }else{
            res += c;
        }
    }
    if(res.at(-1) === "/")res = res.slice(0,-1);
    if(res === "")res = "/";
    return res;
};


const router = {
    rotueMap = new Map;
    add(path,loader){
        this.routeMap.add(path);
    }
    load(path,args){
        
    }
}


