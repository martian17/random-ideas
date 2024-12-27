const apiResponse = require("./apiResponse.json")//{{GetUserEvents.data}};
const records = apiResponse.page.records;
const actions = apiResponse.actions;


const getDeviceType = function(userAgent) {
    const isMobile = /Mobi/i.test(userAgent);
    const isTablet = /Tablet|iPad/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet && /Windows|Macintosh|Linux|Ubuntu/i.test(userAgent);
    
    if (isMobile) {
      return "Mobile";
    } else if (isTablet) {
      return "Tablet";
    } else if (isDesktop) {
      return "Desktop";
    } else {
      return "Unknown";
    }
};

const getOptinValue = function(submission){
    if(!submission)return "";
    return submission.value ? "Y" : "N";
};

const getUnifiedValue = function(type, submission){
    if(!submission)return "";
    switch(type){
        case "SCQ":
        case "SCALE":
        case "FEEDBACK":
            return ""+submission.value;
        case "MCQ":
            return submission.value.join(",");
        default:
            valueLabel = "FIELD_TYPE_UNKNOWN";
    }
}

const tableResponse = {};
const pushToTable = function(label, value){
    if(!(label in tableResponse))
        tableResponse[label] = [];
    tableResponse[label].push(value);
}
for(let record of records){
    pushToTable("Easy ID"   , record.easyId);
    pushToTable("First Name", record.eventType);
    pushToTable("Last Name" , record.firstName);
    pushToTable("Event Type", record.lastName);
    pushToTable("IP"        , record.email);
    pushToTable("Email"     , record.ipAddress);
    pushToTable("Device"    , getDeviceType(record.userAgent));
    pushToTable("Created At", record.createdAt);
    for(let action of actions){
        const submissions = new Map((record?.submissionsByActionId?.[action.id]?.content || []).map(v => [v.id, v]));
        switch(action.type){
            case "LOGIN_CHECK":
            {
                const label = action.label || "Login Check";
                const value = submissions ? "PASS" : "FAIL";
                pushToTable(label, value);
            }
            break;
            case "OPT_IN":
            {
                for(let field of action.data.fields){
                    const label = field.label;
                    const value = getOptinValue(submissions.get(field.id));
                    pushToTable(label, value);
                }
            }
            break;
            case "UNIFIED":
            case "SURVEY":
            case "QUIZ":
            {
                for(let field of action.data.fields){
                    const label = field.label || field.q;
                    const value = getUnifiedValue(field.type,submissions.get(field.id));
                    pushToTable(label, value);
                }
            }
            break;
            default:
                throw new Error(`Unknown action type ${action.type}`);
        }
    }
}

console.log(tableResponse);
