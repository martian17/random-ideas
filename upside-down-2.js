const countUpsideDown = function(a,b){

}


const digmap = {
    "0":0,
    "1":1,
    "6":2,
    "8":3,
    "9":4
};

const reverseMap = {
    "0":"0",
    "1":"1",
    "2":"6",
    "3":"8",
    "4":"9"
};

const toNormalNumber = function(digits){
    //const digits = (""+a)//.split("").reverse().join("");
    let sum = 0;
    for(let d of digits){
        sum *= 5;
        sum += digmap[d];
    }
    return sum;
}

console.log(toNormalNumber("100"));

const updownToNormal = function(digits){
    //const digits = ""+a;
    let even = digits.length%2 === 0;
    let degree = Math.ceil(digits.length/2);
    let half = digits.slice(0,Math.ceil(digits.length/2));
    let n = toNormalNumber(half);
    let base = 5**(degree-1);
    let base1 = 5**(degree)-base;
    n += base;
    if(even)n += base1;
    //console.log(digits,n,base,base1,degree);
    //console.log(normalToUpsideDown(n));
    return n;
}



const normalToUpsideDown = function(n){
    n;
    if(n === 1)return "0";
    let base = 2;
    let degree = 0;
    while(base <= n){
        base *= 5;
        degree++;
    }
    base /= 2*5;
    let base1 = 5**degree-base;
    //console.log(base,base1,degree);
    let even = true;
    if(n < base*2+base1)even = false;
    //console.log(even);
    if(even)n -= base1;
    n -= base;
    //console.log(n);
    let digits = n.toString(5).split("").map(v=>reverseMap[v]);
    if(even){
        return digits.join("")+digits.reverse().join("");
    }else{
        return digits.join("").slice(0,-1)+digits.reverse().join("");
    }
}
// 0 5 25

let r;
for(let i = 0; i < 10000000; i++){
    r = normalToUpsideDown(i);
    //console.log(i,normalToUpsideDown(i));
}
console.log(r,r.length);


//updownToNormal("0");
//updownToNormal("1");
//updownToNormal("6");
//updownToNormal("8");
//updownToNormal("9");
////updownToNormal("00");
//updownToNormal("11");
//updownToNormal("66");
//updownToNormal("88");
//updownToNormal("99");
//updownToNormal("101");
//updownToNormal("111");
//updownToNormal("161");
//updownToNormal("181");
//updownToNormal("191");
//updownToNormal("606");
//updownToNormal("616");
//updownToNormal("666");
//updownToNormal("686");
//updownToNormal("696");
//updownToNormal("808");
//updownToNormal("818");
//updownToNormal("868");
//updownToNormal("888");
//updownToNormal("898");
//updownToNormal("909");
//updownToNormal("919");
//updownToNormal("969");
//updownToNormal("989");
//updownToNormal("999");
//updownToNormal("1001");
//updownToNormal("1111");
//updownToNormal("1661");
//updownToNormal("1881");
//updownToNormal("1991");
//updownToNormal("6006");
//updownToNormal("6116");
//updownToNormal("6666");
//updownToNormal("6886");
//updownToNormal("6996");
//updownToNormal("8008");
//updownToNormal("8118");
//updownToNormal("8668");
//updownToNormal("8888");
//updownToNormal("8998");
//updownToNormal("9009");
//updownToNormal("9119");
//updownToNormal("9669");
//updownToNormal("9889");
//updownToNormal("9999");
//updownToNormal("10001");





