//console.log(document.body.outerHTML);

const view = function(elem){
    console.log(elem,elem.offsetHeight, elem.id, window.getComputedStyle(elem).overflowY);
    for(let child of elem.children){
        const height = child.offsetHeight;
        if(height < 300)continue;
        view(child);
    }

}

view(document.body);

