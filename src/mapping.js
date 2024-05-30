function mapOutArticle(body,startPosition,numberOfElements,article_Name,sectionTypes){
  var sectionTables = [];
  var map = {articleName: article_Name,startElement: null,end:-1, articleTable: null, sectionTables: sectionTables, cleanUpElements: []};

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
      if (map.startElement == null) {
        map.startElement = element;
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
          map.cleanUpElements.push(element)
        }
      }
      else {
        map.cleanUpElements.push(element)
      }
    }
    else if (element.getType() === DocumentApp.ElementType.TABLE) {
      if (map.startElement != null){
        var sectionToUpdate = sectionTables.find(function(section) {
          return section.sectionName === sectionTypeName;
        });
        if (sectionToUpdate) {
          sectionToUpdate.tables.push(element);
        }
        else{
          map.cleanUpElements.push(element)
        }
      } else { //should be article table
        if (map.articleTable == null) { //make sure we only get first table
          map.articleTable = element;
        }
      }
    }
    else if (i < (numberOfElements-1)) {  //dont delete last element
      map.cleanUpElements.push(element) 
    }
  } 
  map.end = i
  return map; 
}

function isValidMap(map){
  var valid = true;
  if (map == null){
    valid = false;
  } else if (map.articleTable == null) {
    valid = false;
    logValidationError("Could not find article table")
  }
  return valid;
}