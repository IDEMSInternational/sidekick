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
    element.removeFromParent();
  })
}

