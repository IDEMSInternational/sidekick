function addNewArticle(jsonObject){
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();
  var articleFields = getArticleFields(jsonObject);
  addAnArticle(body,articleFields,createBlankFields(articleFields),jsonObject.sections,null);
}

function createBlankFields(fields){
  var rowsData = {};
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (field.type == "id"){
      rowsData[field.field] = "New_Article"
    } else {
      rowsData[field.field] = "";
    }
  } 
  return rowsData;
}

function addAnArticle(body,articleFields,articleValues,sections,sectionValues,subItem,subItemValues){
  var header = body.appendParagraph(articleValues.id);
  header.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  addSubTable(body,getArticleFieldsWithoutId(articleFields),articleValues);
  if (subItemValues) {
    addSubItemsToArticle(body,sections,sectionValues,getSubItemFields(subItem),subItemValues,articleValues.id);
  } else {
    addSectionsToArticle(body,sections,sectionValues,articleValues.id);
  }
}

function addSubItemsToArticle(body,sections,sectionValues,subItemFields,subItemValues,id){
  var pageCount = 1;
  subItemValues.forEach(function(line) {
    if (line) {
      if (line['foreign_key'] == id) 
      {
        var header = body.appendParagraph(subItemText + pageCount);
        pageCount++;
        header.setHeading(DocumentApp.ParagraphHeading.HEADING2);  
        addSectionsToArticle(body,sections,sectionValues,line['id']);
      }
    }
  });
}

function addSectionsToArticle(body,sections,sectionsData,id){  
  for (var sectionKey in sections) {
    if (sections.hasOwnProperty(sectionKey)) {
      var section = sections[sectionKey];
      var name = section.name;        
      if ((name) && (sectionsData)) {
        var isFirst = true;      
        sectionData = sectionsData[name];
        sectionData.forEach(function(line) {
          if (line) {
            if (line['foreign_key'] == id)
            {
              if (isFirst){
                var header = body.appendParagraph(name);
                header.setHeading(DocumentApp.ParagraphHeading.SUBTITLE);  
                isFirst = false;
              }
              addSubTable(body,getSectionFields(section),line);
            }
          }
        });
      }    
    }
  }  
}


function addNewSectionToArticle(sectionName, articleName, allArticles, jsonObject,imagesAndNames,updateImage){
  updateImages = updateImage;
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();
  var sectionTypes = getSectionNames(jsonObject);
  
  var numChildren = body.getNumChildren();
  var startPostion = (findPositionOfArticleInList(articleName,allArticles)+1) * 2; //find rough place
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

  reOrderAndAddSectionElements(body,sectionStartLocation,artilceMap.sectionTables,sectionName,jsonObject,allArticles,imagesAndNames);
  console.log("8: " + Date.now())
  deleteNonDefinedElementsInSections(artilceMap.cleanUpElements);  
  console.log("9: " + Date.now())
}

