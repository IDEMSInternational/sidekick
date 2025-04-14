function validateFieldsInArticle(articleName,allArticleNames,jsonObject,imagesAndNames,updateImage){
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();

  var articleMap = getArticleMapFromDoc(body,articleName,allArticleNames,[])
  if (!isValidMap(articleMap)) {
    showError(getValidationLog().toString())
    return;
  }
  validateFields(articleMap.articleTable,getArticleFieldsWithoutId(getArticleFields(jsonObject)))
  updateAssets(articleMap.articleTable,getArticleFields(jsonObject),allArticleNames,imagesAndNames);
}

function getArticleMapFromDoc(body,articleName,allArticleNames,sectionTypes, hasSubItems = false){
  logArticleValidationStart(articleName)
  var numChildren = body.getNumChildren();
  var startPosition = (findPositionOfArticleInList(articleName,allArticleNames)+1) * 2; //find rough place
  startPosition = findPostionOfArticle(body,startPosition,numChildren,articleName) +1; //find exact article place 
  if (startPosition == 0){
    return null
  } else {
    if (hasSubItems){
      return mapOutArticleWithSubItems(body,startPosition,numChildren,articleName,sectionTypes);  
    } else {
      return mapOutArticle(body,startPosition,numChildren,articleName,sectionTypes);
    }
  }
}

function findPostionOfArticle(body,startPosition,numberOfElements,articleName){
  for (var i = startPosition; i < numberOfElements; i++){
    var element = body.getChild(i);
    if (isArticleHeader(element)){
      var article = element.getText()
      if (article == articleName){
        return i;
      }
    }
  }
  logValidationError("Could not find article, Please refesh all articles")
  return -1  
}

function validateSubItemsInArticleAndAdd(articleName, allArticleNames, jsonObject,imagesAndNames,updateImage){
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();

  var articleMap = getArticleMapFromDoc(body,articleName,allArticleNames,getSectionNames(jsonObject),true)
  if (!isValidMap(articleMap)) {
    showError(getValidationLog().toString())
    return;
  }
  reOrderAndAddSubItem(body,getSectionStartLocation(body,articleMap),articleMap.subItems,jsonObject,allArticleNames,imagesAndNames)
  deleteNonDefinedElementsInSections(articleMap.cleanUpElements); 
}


function validateSectionsInSubItemAndAdd(sectionName, subItemIndex, articleName, allArticleNames, jsonObject,imagesAndNames,updateImage){
  //Leave sectionName blank if only validating
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();

  var articleMap = getArticleMapFromDoc(body,articleName,allArticleNames,getSectionNames(jsonObject),true)
  if (!isValidMap(articleMap)) {
    showError(getValidationLog().toString())
    return;
  }
  reOrderAndAddSectionElementsToSubItem(body,getSectionStartLocation(body,articleMap),articleMap.subItems,sectionName,subItemIndex,jsonObject,allArticleNames,imagesAndNames);
  deleteNonDefinedElementsInSections(articleMap.cleanUpElements); 
}

function validateArticle(articleName, allArticleNames, jsonObject,imagesAndNames,updateImage,hasSubItems = false){
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();

  var articleMap = getArticleMapFromDoc(body,articleName,allArticleNames,getSectionNames(jsonObject),hasSubItems)
  if (!isValidMap(articleMap)) {
    showError(getValidationLog().toString())
    return;
  }
  validateFields(articleMap.articleTable,getArticleFieldsWithoutId(getArticleFields(jsonObject)))
  updateAssets(articleMap.articleTable,getArticleFields(jsonObject),allArticleNames,imagesAndNames);
  if (hasSubItems){      
    reOrderAndAddSectionElementsToSubItem(body,getSectionStartLocation(body,articleMap),articleMap.subItems,"",-1,jsonObject,allArticleNames,imagesAndNames)
  } else {
    if (articleMap.sectionTables.length > 0){
      reOrderAndAddSectionElements(body,getSectionStartLocation(body,articleMap),articleMap.sectionTables,"",jsonObject,allArticleNames,imagesAndNames);
    }
  }
  if (articleMap.cleanUpElements.length > 0){
    deleteNonDefinedElementsInSections(articleMap.cleanUpElements);
  }
}

function validateSectionsInArticleAndAdd(sectionName, articleName, allArticleNames, jsonObject,imagesAndNames,updateImage){
  //Leave sectionName blank if only validating
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();

  var articleMap = getArticleMapFromDoc(body,articleName,allArticleNames,getSectionNames(jsonObject))
  if (!isValidMap(articleMap)) {
    showError(getValidationLog().toString())
    return;
  }
  reOrderAndAddSectionElements(body,getSectionStartLocation(body,articleMap),articleMap.sectionTables,sectionName,jsonObject,allArticleNames,imagesAndNames);
  deleteNonDefinedElementsInSections(articleMap.cleanUpElements);  
}

function getSectionStartLocation(body,articleMap){
  //This cannot be done in the map as we have sometimes re-ordered/removed things from the sheet
  if (articleMap.startElement == null) {
    return body.getChildIndex(articleMap.articleTable)+1;
  } else {
    return body.getChildIndex(articleMap.startElement)    
  }
}

function validateAllArticles(allArticles,jsonObject,imagesAndNames,hasSubItems = false){
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();
  var numChildren = body.getNumChildren();
  var allMaps = [];

  var postion = (findPositionOfArticleInList(allArticles[0].name,allArticles)+1) * 2;
  allArticles.forEach(function(article){
    postion = findPostionOfArticle(body,postion,numChildren,article.name) +1 ; 
    if (hasSubItems){
      var articleMap = mapOutArticleWithSubItems(body,postion,numChildren,article.name,getSectionNames(jsonObject));
    } else {
      var articleMap = mapOutArticle(body,postion,numChildren,article.name,getSectionNames(jsonObject));
    }
    postion = articleMap.end -1;
    logArticleValidationStart(article.name)
    if (isValidMap(articleMap)){
      allMaps.push(articleMap);
    }
  })

  allMaps.forEach(function(map){  
    logArticleValidationStart(map.articleName);
    validateFields(map.articleTable,getArticleFieldsWithoutId(getArticleFields(jsonObject)))
    updateAssets(map.articleTable,getArticleFields(jsonObject),allArticles,imagesAndNames);
    if (hasSubItems){      
      reOrderAndAddSectionElementsToSubItem(body,getSectionStartLocation(body,map),map.subItems,"",-1,jsonObject,allArticles,imagesAndNames)
    } else {
      if (map.sectionTables.length > 0){
        reOrderAndAddSectionElements(body,getSectionStartLocation(body,map),map.sectionTables,"",jsonObject,allArticles,imagesAndNames);
      }
    }
    if (map.cleanUpElements.length > 0){
      deleteNonDefinedElementsInSections(map.cleanUpElements);
    }
  })
  return allMaps;
}


function validateAllArticlesAndGetLog(allArticleNames,jsonObject,imagesAndNames,updateImage,hasSubItems = false){
  updateImages = updateImage;
  validateAllArticles(allArticleNames,jsonObject,imagesAndNames,hasSubItems);
  return getValidationLog();
}

function updateAssets(table, fields, allArticles, assets){
  for (var i = 0; i < table.getNumRows(); i++){    
    var fieldName = table.getCell(i,0).getText(); 
    fields.forEach(function(field) {
      if (fieldName === field.field) {
        if (field.type === "asset"){
          updateAsset(table.getCell(i,1),assets)
        }
        if (field.type === "article_link"){
          validateArticleLink(table.getCell(i,1), allArticles)
        }
      }
    });
   
  }
}

function validateArticleLink(cell, allArticles){
  var value = cell.getText();  
  if (allArticles.some(article => article.name === value)){
    cell.setAttributes(validLinkStyle());
  } else {
    cell.setAttributes(invalidLinkStyle());  
    logValidationError("Cannot find link: " + value);   
  }
}

function validateFields(table, fields){
  if (hasRightNumberOfFields(table,fields) && hasRightFieldNames(table,fields)){
    table.setBorderColor(fieldTableBorderColour);
  } else {
    table.setBorderColor(fieldTableInvalidBorderColour);
  }
}

function hasRightNumberOfFields(table, fields){
  var numberOfFields = fields.length;
  fields.forEach(function(field) {
    if ("foreign_key" == field.field) {
      numberOfFields--;
    }
  });
  if (table.getNumRows() === numberOfFields){
    return true;
  } else {
    logValidationError("wrong number of fields")
    return false;
  }
}

function hasRightFieldNames(table, fields){
  var rightFieldNames = true;
  for (var i = 0; i < table.getNumRows(); i++){
    var found = false;
    var fieldName = table.getCell(i,0).getText(); 
    fields.forEach(function(field) {
      if (fieldName === field.field) {
        found = true;
      }
    });
    if (found) {
      table.getCell(i,0).setAttributes(columnNameStyle());
    } else {
      table.getCell(i,0).setAttributes(columnNameInvalidStyle());
      logValidationError("Unexpected field: " + fieldName);
      rightFieldNames = false;
    } 
  }
  return rightFieldNames;
}