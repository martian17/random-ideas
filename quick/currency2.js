const convertCurrency = function(table,st,ed){
    const rates = new Map;
    rates.set(st,1);
    let arr = [...table,...table.map(([a,b,c])=>[b,a,1/c])];
    while(true){
        let arr1 = [];
        for(let [c1,c2,rate] of arr){
            if(rates.has(c2)){
                // do nothing
            }else if(rates.has(c1)){
                rates.set(c2,rate*rates.get(c1));
            }else{
                arr1.push([c1,c2,rate]);
            }
        }
        if(rates.has(ed))return rates.get(ed);
        arr = arr1;
    }
}


console.log(convertCurrency([
    ["USD","JPY",110],
    ["GBP","EUR",1.14],
    ["GBP","RUP",104],
    ["JPY","RUP",0.56],
],"EUR","JPY"));

