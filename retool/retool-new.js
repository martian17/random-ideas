const apiResponse = {{GetUserEvents.data }};
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

const tableResponse = {};
const pushToTable = function(label, value){
    if(!(name in tableResponse))
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
        const submission = record.submissionsByActionId[action.id];
        const submitted = submission !== undefined;
        const submissionFields = new Map((submission?.content || []).map(field => [field.id, field]));

        if(action.type === "LOGIN_CHECK"){
            pushToTable(action.label || "Login Check", submitted? "PASS": "FAIL");
        }else if(action.type === "OPT_IN"){
            for(let field of action.fields){
                const value = !!(submissionFields.get(field.id)?.value);
                const valueLabel = value ? "Y" : "N";
                pushToTable(field.label, submitted? valueLabel : "");
            }
        }else if(["UNIFIED", "QUIZ", "SURVEY"].includes(action.type)){
            for(let field of action.fields){
                const label = field.label || field.q;
                const value = !!(submissionFields.get(field.id)?.value);
                if(!submitted){
                    pushToTable(label, "");
                }else{
                    let valueLabel;
                    switch(field.type){
                        case "SCQ":
                            valueLabel = value;
                        break;
                        case "MCQ":
                            valueLabel = value.join(",");
                        break;
                        case "SCALE":
                            valueLabel = value;
                        break;
                        case "FEEDBACK":
                            valueLabel = value;
                        break;
                        default:
                            valueLabel = "FIELD_TYPE_UNKNOWN";
                    }
                    pushToTable(label, valueLabel);
                }
            }
        }
    }
}


return tableResponse
