import {fft32 as fft, ifft32 as ifft, numbers} from "flat-fft";
import {getDiffusionKernel} from "./diffusionKernel";
import {convolve2d} from "./convolution";

const width = 500;
const height = 500;

const canvas = document.createElement("canvas");

const vecaddi = function(v1: numbers, v2: numbers){
    for(let i = 0; i < v1.length; i++){
        v1[i] += v2[i];
    }
    return v1;
}

class Field{
    vxKernel: Float32Array;
    vyKernel: Float32Array;
    constructor(
        public width: number,
        public height: number,
        public vx: Float32Array,
        public vy: Float32Array,
    ){
        [this.vxKernel, this.vyKernel] = getDiffusionKernel(width, height);
    }
    getVx(x: number, y: number){
        // wrap around
        x = (x+width)%width;
        y = (y+height)%y;
        const idx = y*width+x;
        return this.vx[idx];
    }
    getVy(x: number, y: number){
        // wrap around
        x = (x+width)%width;
        y = (y+height)%y;
        const idx = y*width+x;
        return this.vy[idx];
    }
    // pressure = total amount of perpandicular velocity flowing into the cell
    getPressure(x: number, y: number){
        const vx0 = this.getVx(x-1,y);
        const vx2 = this.getVx(x+1,y);
        const vy0 = this.getVy(x,y-1);
        const vy2 = this.getVy(x,y+1);
        return vx0+vy0-vx2-vy2;// greater index -> invert
    }
    getPressureField(){
        const {width, height} = this;
        const pressureField = new Float32Array(width*height);
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                pressureField[x+width*y] = this.getPressure(x,y);
            }
        }
        return pressureField;
    }
    normalize(){
        const pressureField = this.getPressureField();
        vecaddi(this.vx,convolve2d(pressureField,this.vxKernel,width,height));
        vecaddi(this.vy,convolve2d(pressureField,this.vyKernel,width,height));
    }
    getInterpolatedVx(x: number, y: number){
        
    }
    step(dt: number){
        
    }
}



const field = new Field(width,height,new Float32Array(width*height*2));


