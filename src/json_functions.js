function getJSON(){  //Called from HTML
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();
  return getJSONfromBody(body)
}

function getSheetId(body){
  try {
    var firstTable = body.getTables()[0]; // Get the first table in the document
    return firstTable.getCell(1, 1).getText();
  }
  catch(error){
    showError("Could not find METADATA table, unable to run sidekick"); 
  }
}

function getJSONfromBody(body){
  var spreadsheetId = getSheetId(body);
  var sheetName = 'docJSON'; 
  var range = 'A1'; 
  try {
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    var jsonText = sheet.getRange(range).getValue();
    return jsonObject = JSON.parse(jsonText);
  }
  catch(error){
    showError("Could not open corresponding spreadsheet, Please check Sheet ID and docJSON worksheet")
    return -1;
  }
}

function getSectionJson(jsonObject,sectionName){
  for (var sectionKey in jsonObject.sections) {
    if (jsonObject.sections.hasOwnProperty(sectionKey)) {
      var section = jsonObject.sections[sectionKey];
      if (section.name == sectionName) { 
        return section;
      }
    }
  }  
}

function getSectionNames(jsonObject){
  var sections = [];
  for (var sectionKey in jsonObject.sections) {
    if (jsonObject.sections.hasOwnProperty(sectionKey)) {
      var section = jsonObject.sections[sectionKey];
      sections.push(section.name);  
    }
  }
  return sections;
}

function getImageFileLocations(jsonObject){
  var folderIds = [];
  for (var sectionKey in jsonObject.asset_folders) {
    if (jsonObject.asset_folders.hasOwnProperty(sectionKey)) {
      var folder = jsonObject.asset_folders[sectionKey];
      folderIds.push(folder.id);  
    }
  }
  return folderIds;
}

