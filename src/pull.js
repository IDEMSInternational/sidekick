function pullAllDataFromSheet(){
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var jsonObject = getJSONfromBody(body);

  var spreadsheetId = getSheetId(body);
  var sheetName = jsonObject.sheet; 
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

  var articleFields = getArticleFields(jsonObject);

  deleteFromDocument(body,getIdForFirstTable(body)+1,body.getNumChildren()-1)

  var articleData = pullDataFromSheet(sheet,articleFields);
  var subItemData = jsonObject.sub_item ? pullAllSubItemDataFromSheet(spreadsheetId, jsonObject.sub_item) : null;
  var sectionsData = pullAllSectionDataFromSheet(spreadsheetId,jsonObject.sections)

  var limitedArticle = getLimitedArticle(body);

  articleData.forEach(function(line) {
    if ((limitedArticle == "" ) || (limitedArticle == line.id )) {
      addAnArticle(body,articleFields,line,jsonObject.sections,sectionsData,jsonObject.sub_item,subItemData);
    }
  });
}

function pullDataFromSheet(sheet,fields){
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues(); 
  var headers = data[0]; // Assume first row contains headers
  var rowsData = [];
  for (var i = 1; i < data.length; i++) { // Start from 1 to skip headers row
    var rowData = {};
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j].split('::')[0]; // Extract part before '::'
      // Find the field object in the fields array that matches the current header
      var fieldObj = fields.find(function(field) {
        return field.field === header;
      });
      if (fieldObj) { 
          rowData[header] = data[i][j];
      }
    }
    rowsData.push(rowData);
  }  
  return rowsData;
}

function pullAllSubItemDataFromSheet(spreadsheetId,subItem){
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(subItem.sheet);
  var subItemData = pullDataFromSheet(sheet,getSubItemFields(subItem));    
  return subItemData
}

function pullAllSectionDataFromSheet(spreadsheetId,sections){
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