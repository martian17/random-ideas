
class Matrix{
    constructor(vals,width){
        if(width === undefined){
            width = Math.round(Math.sqrt(vals.length));
        }
        const height = this.height = vals.length/width;
        this.width = width;
        this.vals = vals;
    }
    slice(x,y,w,h){
        const v = [];
        const {width, height, vals} = this;
        for(let i = y; i < y+h; i++){
            for(let j = x; j < x+w; j++){
                v.push(vals[width*(i%height)+(j%width)]);
            }
        }
        console.log(v,w,h);
        return new Matrix(v,w);
    }
    det(){
        const {vals, width, height} = this;
        if(this.width === 2){
            const [a,b,c,d] = vals;
            return a*d-b*c;
        }else if(this.width === 1){
            return vals[0];
        }
        let res = 0;
        for(let i = 0; i < width; i++){
            res += this.slice(i+1,1,width-1,height-1).det() * vals[i];
        }
        return res;
    }
}


console.log((new Matrix([
    -2, -1, 2,
    2,   1, 4,
    -3,  3, 1
])).det());



console.log(a.det());

