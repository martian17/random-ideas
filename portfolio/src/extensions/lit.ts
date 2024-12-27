import { LitElement as _LitElement, html as _html, css as _css } from "lit";

export const css = _css;
export const html = _html;
export type StringMap = {[key:string]: string};
export type CssProps = {[key:string]: string|number|boolean};
export class LitElement extends _LitElement{
    add (nname: HTMLElement | string, attrs?: StringMap, inner?: string | HTMLElement, style?: CssProps): HTMLElement{
        if(nname instanceof HTMLElement){//it's an ELEM
            this.appendChild(nname);
            return nname;
        }
        const node = document.createElement(nname);
        if(attrs){for(let key in attrs){
            node.setAttribute(key,attrs[key]);
        }}
        if(style){for(let key in style){
            (<any>node.style)[key] = style[key];
        }}
        if(inner instanceof HTMLElement){
            this.add(inner);
        }else if(typeof inner === "string"){
            this.innerHTML = inner;
        }
        return node;
    }
    on(evt: string, cb: (...args: any)=>void){
        this.addEventListener(evt,cb);
    }
    off(evt: string, cb: (...args: any)=>void){
        this.removeEventListener(evt,cb);
    }
}




