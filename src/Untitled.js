function addNewSectionToArticle1DELETE(sectionName, articleName, allArticleNames, jsonObject,imagesAndNames,updateImage){
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();
  var sectionTypes = getSectionNames(jsonObject);
  
  var numChildren = body.getNumChildren();
  var startPostion = (findPositionOfStringInList(articleName,allArticleNames)+1) * 2; //find rough place
  startPostion = findPostionOfArticle(body,startPostion,numChildren,articleName) +1; //find exact article place
  if (startPostion == 0) {
    return
  }
  var artilceMap = mapOutArticle(body,startPostion,numChildren,articleName,sectionTypes);
  var sectionStartLocation

  if (artilceMap.startElement == null) {
    if (artilceMap.articleTable != null){
      sectionStartLocation = body.getChildIndex(artilceMap.articleTable)+1;
    } else {
      showError("Could not find article table for: " + articleName);
      return;
    }
  } else {
    sectionStartLocation = body.getChildIndex(artilceMap.startElement)    
  }

  reOrderAndAddSectionElements(body,sectionStartLocation,artilceMap.sectionTables,sectionName,jsonObject,allArticleNames,imagesAndNames);
  console.log("8: " + Date.now())
  deleteNonDefinedElementsInSections(artilceMap.cleanUpElements);  
  console.log("9: " + Date.now())
}

function validateSectionsInArticleDELETE(articleName,allArticleNames,jsonObject,imagesAndNames,updateImage){
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();
  var sectionTypes = getSectionNames(jsonObject);
  
  var numChildren = body.getNumChildren();
  var startPostion = (findPositionOfStringInList(articleName,allArticleNames)+1) * 2; //find rough place
  startPostion = findPostionOfArticle(body,startPostion,numChildren,articleName) +1; //find exact article place

  var articleMap = mapOutArticle(body,startPostion,numChildren,articleName,sectionTypes);

  var test = 1
  if (articleMap.startElement != null) {
    test = body.getChildIndex(articleMap.startElement)
  }

  reOrderAndAddSectionElements(body,test,articleMap.sectionTables,"",jsonObject,allArticleNames,imagesAndNames);
  deleteNonDefinedElementsInSections(articleMap.cleanUpElements);
}


function findAssetDELETE(assets,filename){
 // console.log(filename)
  assets.forEach(function(asset){
  //  console.log(asset.filename)
    var test = (asset.filename.toLowerCase().trim() == filename.toLowerCase().trim())
   // console.log(test)
  //  console.log((asset.filename.toLowerCase().trim() == filename.toLowerCase().trim()))
  //  if (asset.filename.toLowerCase().trim() == filename.toLowerCase().trim()){
    if (test){
   //   console.log("found")
      return asset;
    }
  })
 // console.log("could not find")
  return null;
}


function deleteImageFromCellDELETE(cell){
  var searchType = DocumentApp.ElementType.INLINE_IMAGE;
  var searchResult = null;
  while (searchResult = cell.findElement(searchType, searchResult)) {
    searchResult.getElement().removeFromParent();
  }
}

function getFileIdFromAssetsDELETE(filename,assets){
 // console.log(filename);
 // console.log(assets);v
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].filename.toLowerCase().trim() == filename.toLowerCase().trim()) {
      return assets[i].id;
    }
  }
  return null; // Return null if the filename is not found in the list
}

function getThumbnailUrlDELETE(fileId) {
  var file = DriveApp.getFileById(fileId);
  return file.getThumbnail()//.getUrl();
}


function getImageFromFileDELETE(fileId){
   var thumbnailUrl = getThumbnailUrl(fileId);
   var image = cell.appendImage(thumbnailUrl);
    image.setHeight(imageSize);
    image.setWidth(imageSize);
}

//map article elements
function getAllSectionTablesDELETE(body,startPosition,numberOfElements,sectionTypes){
  var sectionTables = [];
  var allSections = {startElement: null,end:-1, articleTable: null, sectionTables: sectionTables, cleanUpElements: []};

  //create all section tables from sectionTypes
  sectionTypes.forEach(function(sectionType){
    var section = {sectionName:sectionType, tables :[], headers:[]};
    sectionTables.push(section);
  })
  

  //add article table to the loop
  for (var i = startPosition; i < numberOfElements; i++){
    var element = body.getChild(i);
    if (isArticleHeader(element)){
      break;
    }
    if (isSectionHeader(element)){
      if (allSections.startElement == null) {
        allSections.startElement = element;
      }
      if (element.getText().trim() != '') /// easy to have a blank header. should use last section if it is the case
      {
        var sectionTypeName = element.getText();
        var sectionToUpdate = sectionTables.find(function(section) {
          return section.sectionName === sectionTypeName;
        });
        if (sectionToUpdate) {
          sectionToUpdate.headers.push(element);
        } else {
          allSections.cleanUpElements.push(element)
        }
      }
      else {
        allSections.cleanUpElements.push(element)
      }
    }
    else if (element.getType() === DocumentApp.ElementType.TABLE) {
      if (allSections.startElement != null){
        var sectionToUpdate = sectionTables.find(function(section) {
          return section.sectionName === sectionTypeName;
        });
        if (sectionToUpdate) {
          sectionToUpdate.tables.push(element);
        }
        else{
          allSections.cleanUpElements.push(element)
        }
      } else { //should be article table
        if (allSections.articleTable == null) { //make sure we only get first table
          allSections.articleTable = element;
        }
      }
    }
    else {
      allSections.cleanUpElements.push(element) 
    }
  } 
  allSections.end = i
  return allSections; 
}

function reOrderAllSectionsDELETE(allSectionPositions,sectionTypes){
  ///need to make sure header is only done once

  //get range from allSectionPostions
  var currentPostion = 1//get the first postion of range
  sectionTypes.forEach(function(sectionType){

  })
//  for each sectionType in sectionTypes {
//    for each section in allSections{
      if (section.name == sectionType){
        if (section.start != currentPostion){
          //move to current postion          
        }
        currentPostion == currentPostion + (section.end - section.start); 
      }
//    }
//  }
}



function getAllSectionPositionsDELETE(body,startPosition,numberOfElements,sectionTypes){
  //highlight any sections that are not expected
  var sectionPositions = [];
  var sectionPosition = {name:'',start:-1,end:-1}
  for (var i = startPosition; i < numberOfElements; i++){
    var element = body.getChild(i);
    if (isArticleHeader(element)){
      break;
    }
    if (isSectionHeader(element)){
      var sectionTypeName = element.getText()
      if (findPositionOfStringInList(sectionTypeName,sectionTypes) != -1){
        if (sectionPosition.name != ''){
          sectionPosition.end = i-1;
          sectionPositions.push(sectionPosition);
        }       
        var sectionPosition = {
                      name: sectionTypeName,
                      start: i,
                      end: -1
                    };
      }
      else
      {
        //highlight text as should not be there
      }

    }
  } 

  if (sectionPosition.name != ''){
    sectionPosition.end = i-1;
    sectionPositions.push(sectionPosition);
  }
  return sectionPositions
}