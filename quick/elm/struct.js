// Parsing elm record (struct)

[{ allowOverMaxLength = True, autocomplete = Nothing, clickableLabel = True, helperText = Nothing, id = "email", idDom = Nothing, label = "Email", maxWidth = Nothing, minWidth = Nothing, placeholder = Nothing, requiredLabel = Just "(Required)", type_ = TypeText TextEmail, validationSpecs = Just { pretendIsNotValidatedIfValid = False, showAlsoPassedValidation = False, validation = [Required,MinLength 6,MaxLength 100,WithMsg { err = "INVALID_FORMAT", ok = "INVALID_FORMAT" } (Regex "^(?!\\.)(?!.*\\.\\.)[~!#-&+\\--9=?A-Z^-z|]*(?!\\.)[~!#-&+\\--9=?A-Z^-z|]@[-0-9A-Za-z]+(\\.[-0-9A-Za-z]+)*(\\.[-0-9A-Za-z]{2,})$")], validationIcon = NoIcon } },{ allowOverMaxLength = True, autocomplete = Nothing, clickableLabel = True, helperText = Nothing, id = "password", idDom = Nothing, label = "Password", maxWidth = Nothing, minWidth = Nothing, placeholder = Nothing, requiredLabel = Just "(Required)", type_ = TypeText (TextPasswordNew "Show password"), validationSpecs = Just { pretendIsNotValidatedIfValid = False, showAlsoPassedValidation = True, validation = [Required,MinLength 8,MaxLength 128,WithMsg { err = "INVALID_FORMAT_INVALID_CHARACTERS", ok = "INVALID_FORMAT_INVALID_CHARACTERS" } (Regex "^[!-~]*$"),WithMsg { err = "INVALID_FORMAT_NO_UPPERCASE", ok = "INVALID_FORMAT_NO_UPPERCASE" } (Regex "[A-Z]"),WithMsg { err = "INVALID_FORMAT_NO_NUMBER", ok = "INVALID_FORMAT_NO_NUMBER" } (Regex "[0-9]"),WithMsg { err = "INVALID_FORMAT_NO_SPECIAL_CHARACTERS", ok = "INVALID_FORMAT_NO_SPECIAL_CHARACTERS" } (Regex "[~!@#$%^&*()_+|}{\\[\\]|\\><?:\\\";',./=-]")], validationIcon = ErrorOrCheck } },{ allowOverMaxLength = True, autocomplete = Nothing, clickableLabel = True, helperText = Nothing, id = "agreement", idDom = Nothing, label = "List of terms", maxWidth = Nothing, minWidth = Nothing, placeholder = Nothing, requiredLabel = Just "(Required)", type_ = TypeSpecial (SpecialCheckboxGroup ["You agree to Affiliate Mall Spain (ES)'s [Terms and Conditions](https://rakuten.es/terminos-y-condiciones). You acknowledge to have read Affiliate Mall Spain (ES)'s [Privacy Policy](https://rakuten.es/politica-de-privacidad)"]), validationSpecs = Just { pretendIsNotValidatedIfValid = False, showAlsoPassedValidation = False, validation = [Required,WithMsg { err = "INVALID_FORMAT", ok = "INVALID_FORMAT" } (Regex "^(true)$")], validationIcon = ErrorOrNone } },{ allowOverMaxLength = True, autocomplete = Nothing, clickableLabel = True, helperText = Nothing, id = "subscribe", idDom = Nothing, label = "Newsletter", maxWidth = Nothing, minWidth = Nothing, placeholder = Nothing, requiredLabel = Just "(Optional)", type_ = TypeSpecial (SpecialCheckboxGroup ["Subscribe to newsletters from Affiliate Mall Spain (ES)"]), validationSpecs = Just { pretendIsNotValidatedIfValid = False, showAlsoPassedValidation = False, validation = [WithMsg { err = "INVALID_FORMAT", ok = "INVALID_FORMAT" } (Regex "^(true|false)$")], validationIcon = NoIcon } }]



const strmatchtake = function(str,regex){
    let match = str.match(regex);
    if(!match)return false;
    match = match[0];
    return [match,str.slice(0,match.length).trim()];
}

const takeString = function(str){
    str = str.slice(1);
    for(){
    }
}


const takeValue = function(str){
    str = str.trim();
    let match;
    if(str[0] === "["){
        return takeArray(str);
    }else if(str[0] === "{"){
        return takeObject(str);
    }else if(str[0] === "\""){
        return takeString(str);
    }else if(match = strmatchtake(str,/^[0-9]+/)){
        [match,str] = match;
        return [parseInt(match),str];
    }else if(match = strmatchtake(str,/^True/)){
        [match,str] = match;
        return [true,match]
    }else if(match = strmatchtake(str,/^False/)){
        [match,str] = match;
        return [false,match]
    }else if(match = strmatchtake(str,/^None/)){
        [match,str] = match;
        return [null,match]
    }else{
        throw new Error(str.slice(0,30));
    }
}

const parse = function(str){
    str.trim();
    
}
