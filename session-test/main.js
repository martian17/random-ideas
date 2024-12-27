const dummy = document.createElement("input");
dummy.type="text";
document.body.appendChild(dummy);

const a = document.createElement("input");
a.type="text";
document.body.appendChild(a);
const errorArea = document.createElement("pre");
document.body.appendChild(errorArea);

try{
    a.value = sessionStorage.getItem("text") || "";
}catch(err){
    errorArea.innerHTML += `${err}\n\n`
}

a.addEventListener("input",()=>{
    try{
        sessionStorage.setItem("text",a.value);
    }catch(err){
        errorArea.innerHTML += `${err}\n\n`
    }
});



