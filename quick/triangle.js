const getTriangle = function(n){
    return n*(n+1)/2;
}

for(let i = 1; i <= 25; i++){
    console.log(i,getTriangle(i));
}



