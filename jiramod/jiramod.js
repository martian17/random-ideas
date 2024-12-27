const applyStyle = function(elem,style){
    for(let key in style){
        elem.style[key] = style[key];
    }
    return elem;
};
const unsetStyle = function(elem,style){
    for(let key in style){
        elem.style[key] = "unset";
    }
    return elem;
};
const applyAttrs = function(elem,attrs){
    for(let key in attrs){
        elem.setAttribute(key, attrs[key]);
    }
    return elem;
};
const elem = function(parent,params){
    if(!params){
        params = parent;
        parent = undefined;
    }
    const {query,tag="div",attrs={},style={},children=[],child,click=()=>{},load=()=>{},self=()=>{},id,inner,hover,...others} = params;
    let element = query?document.querySelector(query):document.createElement(tag);
    if(id)element.id=id;
    if(child)children.push(child);
    applyStyle(element,style);
    applyAttrs(element,attrs);
    if(inner){
        element.innerHTML = inner;
    }else{
        for(let child of children){
            if(typeof child === "string"){
                element.appendChild(document.createTextNode(child));
            }else{
                element.appendChild(elem(child));
            }
        }
    }
    element.onclick = click;
    for(let key in others){
        element[key] = others[key];
    }
    if(hover){
        element.addEventListener("mouseenter",()=>{
            applyStyle(element,hover);
        });
        element.addEventListener("mouseleave",()=>{
            unsetStyle(element,hover);
            applyStyle(element,style);
        });
    }
    self(element);
    // defer
    setTimeout(()=>load(element),0);
    if(parent){
        parent.appendChild(element);
    }
    return element;
};



const chartPicker = document.getElementById("ghx-chart-picker");
const sprints = [...chartPicker.children].map(op=>({
    id: op.getAttribute("value"),
    title: op.textContent.trim()
}));

const displayArea = document.createElement("div");
const intro = document.getElementById("ghx-chart-intro");
intro.parentNode.insertBefore(displayArea, intro.nextSibling);

const select = elem(displayArea,{
    tag: "select",
    style: {
        outline: "none",
        border: "none",
        backgroundColor: "#ecedf0",
        padding: "7px",
        margin: "5px",
        color: "#334663",
        borderRadius: "3px",
    },
    children: sprints.map(s=>({
        tag: "option",
        value: s.id,
        inner: s.title,
    })),
    onchange: (e)=>{
        renderChart(e.target.value);
    },
});

const chartWidth = intro.offsetWidth-10;
const chartHeight = Math.floor(chartWidth*9/16);
const xmin = 60;
const xmax = chartWidth - 10;
const ymin = 10;
const ymax = chartHeight - 60;
const Xr = r => (xmax-xmin)*r+xmin;
const Yr = r => (ymax-ymin)*r+ymin;

const chart = elem(displayArea,{
    tag: "canvas",
    width: chartWidth,
    height: chartHeight,
});

async function renderChart(sprintId){
    const chartUrl = new URL("https://jira.rakuten-it.com/jira/rest/greenhopper/1.0/rapid/charts/scopechangeburndownchart.json");
    const params = (new URL(window.location)).searchParams;
    chartUrl.searchParams.set("rapidViewId", params.get("rapidView"));
    chartUrl.searchParams.set("sprintId", sprintId);
    chartUrl.searchParams.set("_", Date.now());
    chartUrl.searchParams.set("statisticFieldId", "field_customfield_13200");
    
    const chartData = await fetch(chartUrl.toString()).then(r=>r.json());
    
    console.log(chartData);
    const canvas = chart;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.textAlign = "center";
    // erstens, ein Kästchen
    ctx.strokeStyle = "#ddd";
    ctx.strokeRect(xmin,ymin,(xmax-xmin),(ymax-ymin));
    const {startTime, endTime} = chartData;
    const duration = endTime - startTime;
    const timeToX = function(time){
        return Xr((time-startTime)/duration);
    }
    // draw the date
    let day = startTime-startTime%(1000*60*60*24)+new Date().getTimezoneOffset()*1000*60;
    if(day < startTime) day += 24*60*60*1000;
    while(day < endTime){
        ctx.beginPath()
        ctx.moveTo(timeToX(day),ymax);
        ctx.lineTo(timeToX(day),ymax+12);
        ctx.stroke();
        ctx.fillText(new Date(day).toString().split(" ").slice(1,3).join(" "), timeToX(day), ymax+20);
        ctx.fillText(new Date(day).toString().split(" ")[0], timeToX(day), ymax+30);
        day += 24*60*60*1000;
    }

    // draw the guideline
    const isOff = function(time){
        const day = new Date(time).split(" ")[0];
        return day === "Sat" || day === "Sun";
    }
    day = startTime-startTime%(1000*60*60*24)+new Date().getTimezoneOffset()*1000*60;
    if(day < startTime) day += 24*60*60*1000;
    const holidays = [];
    const workdays = [];
    if(isOff(startTime))holidays.push(startTime);
    while(day < endTime){
        ctx.beginPath()
        ctx.moveTo(timeToX(day),ymax);
        ctx.lineTo(timeToX(day),ymax+12);
        ctx.stroke();
        ctx.fillText(new Date(day).toString().split(" ").slice(1,3).join(" "), timeToX(day), ymax+20);
        ctx.fillText(new Date(day).toString().split(" ")[0], timeToX(day), ymax+30);
        day += 24*60*60*1000;
    }
}
