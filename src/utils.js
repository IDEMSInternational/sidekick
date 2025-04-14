
function isArticleHeader(element){
  return (element.getType() === DocumentApp.ElementType.PARAGRAPH) && (element.getHeading() === DocumentApp.ParagraphHeading.HEADING1)
}

function isSubItemHeader(element){
  return (element.getType() === DocumentApp.ElementType.PARAGRAPH) && (element.getHeading() === DocumentApp.ParagraphHeading.HEADING2)
}


function isSectionHeader(element){
  return (element.getType() === DocumentApp.ElementType.PARAGRAPH) && (element.getHeading() === DocumentApp.ParagraphHeading.SUBTITLE)
}

function findPositionOfStringInList(target, list){
  for (var i = 0; i < list.length; i++) {
    if (list[i] === target) {
      return i; 
    }
  }
  //show error message
  return -1; 
};

function findPositionOfArticleInList(name, articleList){
  for (var i = 0; i < articleList.length; i++) {
    if (articleList[i].name === name) {
      return i; 
    }
  }
  //show error message
  return -1; 
};