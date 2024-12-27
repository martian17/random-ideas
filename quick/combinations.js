const C = function(n,r){
    let num = 1;
    let den = 1;
    for(let i = 1; i <= r; i++){
        num *= i;
        den *= i+(n-r);
    }
    return den/num
}

const calcComb = function(n){
    let sum = 0;
    for(let i = 1; i <= n; i++){
        sum += C(n,i);
    }
    return sum;
}

console.log(calcComb(10));

