const apiResponse = {{GetUserEvents.data }};
const records = apiResponse.page.records;
const actionsData = apiResponse.actions;

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

    // const submissions = record.submissionsByActionId;
    // 
    // for(let action of actionsData){
    //     //actions without fields (ex LOGIN_CHECK)
    //     const submission = submissions[action.id];
    //     if(action.type === "LOGIN_CHECK"){
    //         const value = submission?.content;
    //         pushToTable(action.label, value === null ? "" : value)
    //     }else if(action.type === "OPT_IN"){
    //         for(let field of action.data.fields){
    //             const label = field.label || field.q;
    //             const value = submission.content;
    //         }
    //         
    //     } else { //actions with fields (ex: QUIZ, SURVEY etc)
    //       //parse question by question
    //         Array.prototype.forEach.call(action.data.fields, actionField => {
    //           let fieldLabel = (actionField.label === undefined) ? actionField.q : actionField.label
    //           if (tableResponse[fieldLabel] === undefined) {
    //             tableResponse[fieldLabel] = []
    //           }
    //           let fieldValue = ""
    //           if (submissions !== null && submissions[action.id] !== undefined) {
    //             fieldValue = submissions[action.id]?.content.find(oneActionSubmission => oneActionSubmission.id == actionField.id)?.value
    //           }

    //           fieldValue = convertBooleanValue(fieldValue);
    //           
    //           tableResponse[fieldLabel].push(fieldValue)
    //         })
    //     }                         

    // }
}

actionsData.forEach(action => {
      Array.prototype.forEach.call(records, record => {
      })
})

function getDeviceType(userAgent) {
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
}


const noramalizeOptinResponse = function(){

// Convert true or false to Y or N respectively
function convertBooleanValue(input) {
    if (typeof input === 'boolean') {
        return input ? 'Y' : 'N';
      } else {
        return input;
      }
}


return tableResponse
