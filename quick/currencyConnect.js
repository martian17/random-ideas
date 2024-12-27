






const withReverse = function*(table){
    for(let [c1,c2,rate] of table){
        yield [c1,c2,rate];
        yield [c2,c1,1/rate];
    }
}

class MinHeap{
    weights = [-Infinity];
    items = [null];
    add(item,weight){
        const {weights,items} = this;
        let idx = this.weights.length;
        while(true){
            const parentIdx = Math.floor(idx/2);
            const wp = weights[parentIdx];
            if(wp <= weight)break;
            weights[idx] = wp;
            items[idx] = items[parentIdx];
            idx = parentIdx;
        }
        weights[idx] = weight;
        items[idx] = item;
    }
    pop(){
        const {weights,items} = this;
        if(weights.length === 1)return false;
        let res = [items[1],weights[1]];
        let idx = 1;
        let weight = weights.pop();
        let item = items.pop();
        const len = weights.length;
        if(len === 1)return res;
        let idx1, idx2;
        while((idx2 = (idx1 = idx * 2) + 1) < len){
            const idxc = weights[idx1] < weights[idx2] ? idx1 : idx2;
            const wc = weights[idxc];
            if(wc >= weight){
                weights[idx] = weight;
                items[idx] = item;
                return res;
            }
            weights[idx] = weights[idxc];
            items[idx] = items[idxc];
            idx = idxc;
        }
        if(idx1 < len){
            const idxc = idx1;
            const wc = weights[idxc];
            if(wc >= weight){
                weights[idx] = weight;
                items[idx] = item;
                return res;
            }
            weights[idx] = weights[idxc];
            items[idx] = items[idxc];
            idx = idxc;
        }
        weights[idx] = weight;
        items[idx] = item;
        return res;
    }
}


const convertCurrency = function(table,st,ed){
    //build verts
    const verts = new Map;
    for(let [c1,c2,rate] of withReverse(table)){
        let edge = verts.get(c1);
        if(!edge){
            edge = [];
            verts.set(c1,edge);
        }
        edge.push([c2,rate]);
    }
    //run dijkstra on verts
    const heap = new MinHeap();
    heap.add(st,0);
    const links = new Map;
    const rates = new Map;
    rates.set(st,1);
    outer:
    while(true){
        const [c1,dist] = heap.pop();
        for(let [c2,rate] of verts.get(c1)){
            if(links.has(c2))
                continue;
            links.set(c2,c1)
            rates.set(c2,rates.get(c1)*rate);
            if(c2 === ed)
                break outer;
            heap.add(c2,dist+1);
        }
    }
    let chain = [];
    for(let currency = ed; currency != st; currency = links.get(currency)){
        chain.push(currency);
    }
    chain.push(st);
    console.log(chain.reverse());
    return rates.get(ed);
}

console.log(convertCurrency([
    ["USD","JPY",110],
    ["GBP","EUR",1.14],
    ["GBP","RUP",104],
    ["JPY","RUP",0.56],
],"EUR","JPY"));

