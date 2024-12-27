const skipSpaces = function(str,i){
    for(; i < str.length; i++){
        if(str[i] === " " || str[i] === "\n" || str[i] === "\r" || str[i] === "\t"){
            continue;
        }else if(str[i] === "/" && str[i+1] === "*"){
            i+=2;
            for(; i < str.length; i++){
                if(str[i] === "*" && str[i+1] === "/"){
                    i+=1;
                    break;
                }
            }
            // now it points to the end of the comment
        }else{
            return i;
        }
    }
    return i;
}

const parseCSSAttributes = function(str,i){
    let res = [];
    while(i < str.length){
        i = skipSpaces(str,i);
        if(i >= str.length)break;
        if(str[i] === "}"){
            i++;
            break;
        }
        let start = i;
        for(; i < str.length; i++){
            i = skipSpaces(str,i);
            if(str[i] === ":")break;
        }
        let key = str.slice(start,i);
        i++;
        start = i;
        let value;
        for(; i < str.length; i++){
            i = skipSpaces(str,i);
            if(str[i] === "}"){
                value = str.slice(start,i);
                break;
            }
            if(str[i] === ";"){
                value = str.slice(start,i);
                i++;
                break;
            }
        }
        res.push([key.trim(),value.trim()]);
    }
    return [res,i]
}

const parseCSS = function(str,i){
    let res = [];
    while(i < str.length){
        i = skipSpaces(str,i);
        if(i >= str.length)break;
        if(str[i] === "@"){
            // media query
            let start = i;
            for(; i < str.length; i++){
                i = skipSpaces(str,i);
                if(str[i] === "{")break;
            }
            const mqName = str.slice(start,i);
            let mqItems;
            [mqItems, i] = parseCSS(str,i+1);
            res.push({
                mq: mqName.trim(),
                items: mqItems,
            });
        }else if(str[i] === "}"){
            i++;
            break;
        }else{
            let start = i;
            for(; i < str.length; i++){
                i = skipSpaces(str,i);
                if(str[i] === "{")break;
            }
            const name = str.slice(start,i);
            let attrs;
            [attrs, i] = parseCSSAttributes(str,i+1);
            res.push({
                selector: name.trim(),
                attrs: attrs,
            });
        }
    }
    return [res, i];
}

console.log(JSON.stringify(parseCSS(`

    #login-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    #login-image {
      width: 100%;
    }

    #login-widget {
      width: 100%;
      display: flex;
      flex-direction: column;
      max-width: 440px;
      min-height: 622px;
      position: absolute;
      top: 32px;
      left: 50%;
      box-shadow: 0 20px 50px #0000001a;
      border-radius: 16px;
      overflow: clip;
      transition: opacity 1s;
    }

    #result {
      max-width: 440px;
      position: absolute;
      left: 55%;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    #result-text {
      font-size: 24px;
    }

    #logout-button {
      display: none;
      background-color: #bf0000;
      color: white;
      font-size: 18px;
      line-height: 2.45;
      border-radius: 24px;
      border: none;
      width: 150px;
    }

    #login-image > img {
      width: 100%;
      object-fit: contain;
    }

    #login-modal-container {
      display: none;
      position: fixed;
      align-items: center;
      justify-content: center;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.4);
    }

    #login-modal {
      display: flex;
      flex-direction: column;
      z-index: 1;
      max-width: 440px;
      max-height: 650px;
      height: 100vh;
      overflow-y: auto;
      opacity: 0;
      transition: opacity 0.5s;
    }

    #popupButton {
      background-color: white;
      border-radius: 32px;
      padding: 8px 12px;
      border: 1px solid grey;
    }

    .banner-image {
      width: 100%;
      object-fit: contain;
    }

    .banner-image-mobile {
      width: 100%;
      object-fit: contain;
      display: none;
    }

    #account-button {
      background: transparent;
      font-size: 0;
      border: none;
      position: absolute;
      top: 1.5%;
      right: 1.5%;
      width: 3vw;
      height: 3vw;
    }

    @media only screen and (max-width: 768px) {
      .banner-image {
        display: none;
      }

      .banner-image-mobile {
        display: block;
      }

      #login-container {
        flex-direction: column;
      }

      #login-widget {
        position: unset;
        box-shadow: none;
        border-radius: 0;
      }

      #result {
        position: unset;
        left: unset;
        align-items: center;
        padding-top: 24px;
      }

      #account-button {
        background: transparent;
        font-size: 0;
        border: none;
        position: absolute;
        top: 1%;
        right: 1%;
        width: 10vw;
        height: 10vw;
      }
    }


`,0),null,4));


