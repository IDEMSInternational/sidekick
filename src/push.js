


function pushAllDataToSheet(allArticleNames,jsonObject,imagesAndNames){

  ///will need to split out getting body and pass in
  var allMaps = validateAllArticles(allArticleNames,jsonObject,imagesAndNames)
  console.log(allMaps.length)
  console.log("maps created") 

  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var spreadsheetId = getSheetId(body);

  var articleSheetName = jsonObject.sheet; 
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var articleSheet = spreadsheet.getSheetByName(articleSheetName);
  var sectionSheets = [];

  if (isValidDocument()){
    deleteExistingData(spreadsheet,jsonObject);
    console.log("deleted data")
    allMaps.forEach(function(map){
     // console.log(map)
     // console.log(map.articleTable);
     // console.log(jsonObject.article_id);
      console.log(map.articleName);
      pushDataToSheetWithSpecifiedId(articleSheet,map.articleTable,jsonObject.article_id,map.articleName)


      for (var i = 0; i < map.sectionTables.length; i++) {
        var sectionTable = map.sectionTables[i];  
        if (sectionTable.tables.length > 0) {
          var jsonSection = getSectionJson(jsonObject,sectionTable.sectionName);
          var sectionSheet = spreadsheet.getSheetByName(jsonSection.sheet);
          for (var j = 0; j < sectionTable.tables.length; j++) {
            var table = sectionTable.tables[j];
            pushDataToSheetWithAutoId(sectionSheet,table,"id",jsonSection.foreign_key,map.articleName)
          }
        }
      }
    })
  } else {
    var ui = DocumentApp.getUi();
    var response = ui.alert(
     'Error',
     'Cannot push to spreadsheet. Please see validation errors',
      ui.ButtonSet.OK);
  }

  return getValidationLog();
}

function deleteExistingData(spreadsheet,jsonObject){
  deleteAllRows(spreadsheet.getSheetByName(jsonObject.sheet))
  var sections = [];
  for (var sectionKey in jsonObject.sections) {
    if (jsonObject.sections.hasOwnProperty(sectionKey)) {
      var section = jsonObject.sections[sectionKey];
      deleteAllRows(spreadsheet.getSheetByName(section.sheet));  
    }
  }
}

function deleteAllRows(sheet){
  var lastRow = sheet.getLastRow();  
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
}

function getSheetHeaders(sheet){
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues(); 
  var headers = data[0]; // Assume first row contains headers
  for (var i = 0; i < headers.length; i++) {
    headers[i] = headers[i].split('::')[0].trim();
  }
  return headers;
}

function getSheetRowForTable(headers,table){
  var newRow = Array(headers.length).fill('');
  for (var i = 0; i < table.getNumRows(); i++) {
    var field = table.getCell(i,0).getText();
    var value = table.getCell(i,1).getText();
    var colIndex = headers.indexOf(field);
    if (colIndex != -1) {
      newRow[colIndex] = value;
    }
  }
  return newRow;
}

function pushDataToSheetWithSpecifiedId(sheet,table, idField,idValue){
  var headers = getSheetHeaders(sheet);
  var newRow = getSheetRowForTable(headers,table)

  var colIndex = headers.indexOf(idField);
  if (colIndex != -1) {
    newRow[colIndex] = idValue;
  }
  sheet.appendRow(newRow);
}

function addValueToRow(row, headers, field, value){
  var colIndex = headers.indexOf(field);
  if (colIndex != -1) {
    row[colIndex] = value;
  }
}

function pushDataToSheetWithAutoId(sheet,table,idField,foreignKeyField, foreignKeyValue){
  var headers = getSheetHeaders(sheet);
  var newRow = getSheetRowForTable(headers,table)

  var lastRow = sheet.getLastRow();
//  var colIndex = headers.indexOf(idField);
 // if (colIndex != -1) {
 //   newRow[colIndex] = lastRow;
 // }

  addValueToRow(newRow, headers, idField,lastRow);
  addValueToRow(newRow, headers, foreignKeyField, foreignKeyValue)
  sheet.appendRow(newRow);
}

function pushAllSectionDataToSheet(spreadsheetId,sections){
  var allSectionsData = {};
  for (var sectionKey in sections) {
    if (sections.hasOwnProperty(sectionKey)) {
      var section = sections[sectionKey];
      var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(section.sheet);
      var sectionData = pullDataFromSheet(sheet,getSectionFields(section));    
      allSectionsData[section.name] = sectionData;  
    }
  }
  return allSectionsData
}