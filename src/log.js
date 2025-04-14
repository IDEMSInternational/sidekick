noErrorsText = "No validation errors detected"

validationLog = [];
currentValidationArticle = '';
currentSection ='';
currentSubItemId = '';

function logArticleValidationStart(articleName){
  currentValidationArticle = articleName;
  currentSection ='';
}

function logSectionValidationStart(sectionName){
  currentSection = sectionName;
}

function logSectionSubItemStart(subItemId){
  currentSubItemId = subItemId;
}

function logValidationError(error){
  //TODO log subItemId
  if (currentSection == ''){
    validationLog.push(currentValidationArticle + ": " + error);
  } else {
    validationLog.push(currentValidationArticle + " (" +currentSection+") :" + error);
  }
}

function getValidationLog(){
  if (validationLog.length < 1) {
    validationLog.push(noErrorsText)
  }
  return validationLog
}


function isValidDocument(){
  return (validationLog[0] == noErrorsText) || (validationLog.length < 1)
}