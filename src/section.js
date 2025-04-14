function reOrderAndAddSectionElements(body,startLocation,sectionTables,newSectionName,jsonObject,allArticleNames,imagesAndNames){
  for (var i = sectionTables.length - 1; i >= 0; i--) {
    var sectionTable = sectionTables[i];
    logSectionValidationStart(sectionTable.sectionName);
    if ((newSectionName != "" ) && (sectionTable.sectionName == newSectionName)){
      var sectionFields = getSectionFields(getSectionJson(jsonObject,newSectionName));
      insertSubTable(body,sectionFields,createBlankFields(sectionFields),startLocation);
    }    
    if (sectionTable.tables.length > 0) {
      for (var j = sectionTable.tables.length - 1; j >= 0; j--) {
        var table = sectionTable.tables[j];
        table.removeFromParent();
        var bodyTable = body.insertTable(startLocation,table.asTable());
        validateFields(bodyTable,getSectionFields(getSectionJson(jsonObject,sectionTable.sectionName)));
        updateAssets(bodyTable,getSectionFields(getSectionJson(jsonObject,sectionTable.sectionName)),allArticleNames,imagesAndNames);
      }
      //remove old headers
      sectionTable.headers.forEach(function(element){
        element.removeFromParent();
      })
    }
    if ((sectionTable.tables.length > 0) || (sectionTable.sectionName == newSectionName)){
      var header = body.insertParagraph(startLocation,sectionTable.sectionName);
      header.setHeading(DocumentApp.ParagraphHeading.SUBTITLE);    
      
    }
  }
}

function deleteNonDefinedElementsInSections(cleanUpElements){
  cleanUpElements.forEach(function(element){
    var test = element.toString();
    var test2 = element.getParent();
    if (test2 !== null)
    {
    element.removeFromParent();
    }
  })
}


function reOrderAndAddSubItem(body,startLocation,subItems,jsonObject,allArticleNames,imagesAndNames){

  var header = body.insertParagraph(startLocation,subItemText + (subItems.length + 1));
  header.setHeading(DocumentApp.ParagraphHeading.HEADING2); 
  for (var i = subItems.length - 1; i >= 0; i--) {
    var subItem = subItems[i];
    logSectionSubItemStart(i+1);
    reOrderAndAddSectionElements(body,startLocation,subItem.sectionTables,'',jsonObject,allArticleNames,imagesAndNames);
    var header = body.insertParagraph(startLocation,subItemText + (i+1));
    header.setHeading(DocumentApp.ParagraphHeading.HEADING2);     
    subItem.header.removeFromParent();
  }
      
}

function reOrderAndAddSectionElementsToSubItem(body,startLocation,subItems,newSectionName,newSectionSubItemId,jsonObject,allArticleNames,imagesAndNames){
  for (var i = subItems.length - 1; i >= 0; i--) {
    var subItem = subItems[i];
    logSectionSubItemStart(i+1);
    if (i == newSectionSubItemId){
      reOrderAndAddSectionElements(body,startLocation,subItem.sectionTables,newSectionName,jsonObject,allArticleNames,imagesAndNames);    
    } else {
      reOrderAndAddSectionElements(body,startLocation,subItem.sectionTables,'',jsonObject,allArticleNames,imagesAndNames);
    }
    var header = body.insertParagraph(startLocation,subItemText + (i+1));
    header.setHeading(DocumentApp.ParagraphHeading.HEADING2);     
    subItem.header.removeFromParent();
  }
}