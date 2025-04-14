
function pushAllDataToSheet(allArticleNames,jsonObject,imagesAndNames, hasSubItems = true){ //this should default as false

  ///will need to split out getting body and pass in
  console.log("hasSubItems: " + hasSubItems) 
  hasSubItems = true; //this is temporary due to strange error
  console.log("hasSubItems: " + hasSubItems) 
  var allMaps = validateAllArticles(allArticleNames,jsonObject,imagesAndNames,hasSubItems)
  console.log(allMaps.length)
  console.log("maps created") 
  console.log("hasSubItems: " + hasSubItems) 
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var spreadsheetId = getSheetId(body);

  
  var limitedArticle = getLimitedArticle(body);

  var articleSheetName = jsonObject.sheet; 
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var articleSheet = spreadsheet.getSheetByName(articleSheetName);
  var subItemSheet = spreadsheet.getSheetByName(jsonObject.sub_item.sheet);
  var sectionSheets = [];

  if (isValidDocument()){
    if (limitedArticle == "" ){
      deleteExistingData(spreadsheet,jsonObject);
    } else {
      deleteSpecificData(spreadsheet,jsonObject,limitedArticle);
    }
    console.log("deleted data")
    allMaps.forEach(function(map){
     // console.log(map)
     // console.log(map.articleTable);
     // console.log(jsonObject.article_id);
      if ((limitedArticle == "" ) || (limitedArticle == map.articleName ))
      {
        console.log(map.articleName);
        if (limitedArticle == "" ) {
          pushDataToSheetWithSpecifiedId(articleSheet,map.articleTable,jsonObject.article_id,map.articleName)
        }
        else {
          updateDataWithSpecifiedId(articleSheet,map.articleTable,jsonObject.article_id,map.articleName)
        }

        if (hasSubItems){
          for (var i = 0; i < map.subItems.length; i++) {
            var subItemId = pushDataToSheetWithAutoId(subItemSheet,null,jsonObject.sub_item.sub_item_id,"sub_item",jsonObject.sub_item.foreign_key,map.articleName);
            for (var j = 0; j < map.subItems[i].sectionTables.length; j++) {
            var sectionTable = map.subItems[i].sectionTables[j];  
            if (sectionTable.tables.length > 0) {
              var jsonSection = getSectionJson(jsonObject,sectionTable.sectionName);
              var sectionSheet = spreadsheet.getSheetByName(jsonSection.sheet);
              for (var k = 0; k < sectionTable.tables.length; k++) {
                var table = sectionTable.tables[k];
                pushDataToSheetWithAutoId(sectionSheet,table,"id",sectionTable.sectionName,jsonSection.foreign_key,subItemId)
              }
            }
          }     

          }
        } else {
          for (var i = 0; i < map.sectionTables.length; i++) {
            var sectionTable = map.sectionTables[i];  
            if (sectionTable.tables.length > 0) {
              var jsonSection = getSectionJson(jsonObject,sectionTable.sectionName);
              var sectionSheet = spreadsheet.getSheetByName(jsonSection.sheet);
              for (var j = 0; j < sectionTable.tables.length; j++) {
                var table = sectionTable.tables[j];
                pushDataToSheetWithAutoId(sectionSheet,table,"id",jsonObject,sectionTable.sectionName,jsonSection.foreign_key,map.articleName)
              }
            }
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



function pushAllDataToSheetOLD(allArticleNames,jsonObject,imagesAndNames){

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
            pushDataToSheetWithAutoId(sectionSheet,table,"id",sectionTable.sectionName,jsonSection.foreign_key,map.articleName)
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

function deleteSpecificData(spreadsheet,jsonObject,article){
  if (jsonObject.sub_item){
    var subItemIds = deleteSpecficRows(spreadsheet.getSheetByName(jsonObject.sub_item.sheet),jsonObject.sub_item.foreign_key,article)
    for (var sectionKey in jsonObject.sections) {
      if (jsonObject.sections.hasOwnProperty(sectionKey)) {
        var section = jsonObject.sections[sectionKey];
        deleteSpecificRowsByList(spreadsheet.getSheetByName(section.sheet),section.foreign_key,subItemIds);  
      }
    }    

  } else {
    for (var sectionKey in jsonObject.sections) {
      if (jsonObject.sections.hasOwnProperty(sectionKey)) {
        var section = jsonObject.sections[sectionKey];
        deleteSpecficRows(spreadsheet.getSheetByName(section.sheet),section.foreign_key,article);  
      }
    }    
  }
}

function deleteExistingData(spreadsheet,jsonObject){
  deleteAllRows(spreadsheet.getSheetByName(jsonObject.sheet))
  if (jsonObject.sub_item){
    deleteAllRows(spreadsheet.getSheetByName(jsonObject.sub_item.sheet))
  }
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

function updateDataWithSpecifiedId(sheet,table, idField,idValue){
  var headers = getSheetHeaders(sheet);
  var newRow = getSheetRowForTable(headers, table);
  var colIndex = headers.indexOf(idField);
  
  if (colIndex === -1) {
    Logger.log("Column not found: " + idField);
    return;
  }
  
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  
  for (var i = 1; i < data.length; i++) { // Skip header row
    if (data[i][colIndex] == idValue) {
      for (var j = 0; j < newRow.length; j++) {
        if (newRow[j] !== '') { // Only update non-empty values
          sheet.getRange(i + 1, j + 1).setValue(newRow[j]);
        }
      }
      return;
    }
  }
  
  // If ID not found, append new row
  newRow[colIndex] = idValue;
  sheet.appendRow(newRow);
}

function getSheetRowForTable(headers, table) {
  var newRow = Array(headers.length).fill('');
  if (table) {
    for (var i = 0; i < table.getNumRows(); i++) {
      var field = table.getCell(i, 0).getText();
      var value = table.getCell(i, 1).getText();
      var colIndex = headers.indexOf(field);
      if (colIndex != -1) {
        newRow[colIndex] = value;
      }
    }
  }
  return newRow;
}

function deleteSpecificRowsByList(sheet, foreignKeyField, foreignKeyValues) {
  var headers = getSheetHeaders(sheet);
  var columnIndex = headers.indexOf(foreignKeyField);
  
  if (columnIndex === -1) {
    Logger.log("Column not found: " + foreignKeyField);
    return;
  }
  
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  var rowsToDelete = [];
  
  for (var i = data.length - 1; i > 0; i--) { // Start from the bottom to avoid shifting issues
    if (foreignKeyValues.includes(data[i][columnIndex])) {
      rowsToDelete.push(i + 1); // +1 because Sheets uses 1-based index
    }
  }
  
  rowsToDelete.forEach(function(rowIndex) {
    sheet.deleteRow(rowIndex);
  });
}

function deleteSpecficRows(sheet,foreignKeyField,foreignKeyValue){
  var headers = getSheetHeaders(sheet);
  var columnIndex = headers.indexOf(foreignKeyField);
  var idColumnIndex = headers.indexOf("id"); // Assuming "id" is the identifier field
  
  if (columnIndex === -1 || idColumnIndex === -1) {
    Logger.log("Column not found: " + foreignKeyField + " or id");
    return [];
  }
  
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  var rowsToDelete = [];
  var deletedIds = [];
  
  for (var i = data.length - 1; i > 0; i--) { // Start from the bottom to avoid shifting issues
    if (data[i][columnIndex] == foreignKeyValue) {
      deletedIds.push(data[i][idColumnIndex]);
      rowsToDelete.push(i + 1); // +1 because Sheets uses 1-based index
    }
  }
  
  rowsToDelete.forEach(function(rowIndex) {
    sheet.deleteRow(rowIndex);
  });
  
  return deletedIds;
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
  if (table){
    for (var i = 0; i < table.getNumRows(); i++) {
      var field = table.getCell(i,0).getText();
      var value = table.getCell(i,1).getText();
      var colIndex = headers.indexOf(field);
      if (colIndex != -1) {
        newRow[colIndex] = value;
      }
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

function pushDataToSheetWithAutoId(sheet,table,idField, idPrefix,foreignKeyField, foreignKeyValue){
  var headers = getSheetHeaders(sheet);
  var newRow = getSheetRowForTable(headers, table);
  var idColumnIndex = headers.indexOf(idField);
  var lastId = idPrefix + "0"; // Default ID if no previous rows
  
  if (idColumnIndex !== -1) {
    var dataRange = sheet.getDataRange();
    var data = dataRange.getValues();
    
    for (var i = data.length - 1; i > 0; i--) { // Start from last row to find the latest ID
      var currentId = data[i][idColumnIndex];
      if (currentId && currentId.startsWith(idPrefix)) {
        var numericPart = parseInt(currentId.replace(idPrefix, ""), 10);
        if (!isNaN(numericPart)) {
          lastId = idPrefix + (numericPart + 1);
        }
        break;
      }
    }
  }
  
  addValueToRow(newRow, headers, idField, lastId);
  addValueToRow(newRow, headers, foreignKeyField, foreignKeyValue);
  sheet.appendRow(newRow);
  return lastId;
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