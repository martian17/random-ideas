const apiResponse = require("./devApiResponse.json")//{{GetUserEvents.data}};
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

const getOptinValue = function(submitted, submission){
    if(!submitted)return "";
    return submission?.value ? "Y" : "N";
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
tableResponse["Easy ID"   ] = records.map(r=>r.easyId);
tableResponse["First Name"] = records.map(r=>r.firstName);
tableResponse["Last Name" ] = records.map(r=>r.lastName);
tableResponse["Event Type"] = records.map(r=>r.eventType);
tableResponse["IP"        ] = records.map(r=>r.ipAddress);
tableResponse["Email"     ] = records.map(r=>r.email);
tableResponse["Device"    ] = records.map(r=>getDeviceType(r.userAgent));
tableResponse["Remark"    ] = records.map(r=>r.remark);
tableResponse["Created At"] = records.map(r=>r.createdAt);


for(let action of actions){
    //submissions by action
    const entries = records.map(record=>{
        const subs = record?.submissionsByActionId?.[action.id];
        return {
            submissions: new Map((subs?.content?.data /*backwards compatibility*/ || subs?.content || []).map(v => [v.id, v])),
            submitted: !!subs
        }
    });
    switch(action.type){
        case "LOGIN_CHECK":
        {
            tableResponse[action.label || "Login Check"] =
                entries.map(e=>e.submissions ? "PASS" : "FAIL");
        }
        break;
        case "OPT_IN":
        {
            for(let field of action.data.fields){
                tableResponse[field.label] =
                    entries.map(e=>getOptinValue(e.submitted, e.submissions.get(field.id)));
            }
        }
        break;
        case "UNIFIED":
        case "SURVEY":
        case "QUIZ":
        {
            for(let field of action.data.fields){
                tableResponse[field.label || field.q] =
                    entries.map(e=>getUnifiedValue(field.type,e.submissions.get(field.id)));
            }
        }
        break;
        default:
            throw new Error(`Unknown action type ${action.type}`);
    }
}

console.log(tableResponse);
