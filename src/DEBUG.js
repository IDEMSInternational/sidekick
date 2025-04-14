function myFunction() {
  jsonObject = getJSON();
  allArticleNames = getArticlesAndSubItemNamesFromDoc();
  validateSubItemsInArticleAndAdd("onboarding_day_chat", allArticleNames, jsonObject,[],false)
}


function myFunction2() {
  jsonObject = getJSON();
  allArticleNames = getArticlesAndSubItemNamesFromDoc();
  validateSectionsInSubItemAndAdd("section",1,"onboarding_day_chat", allArticleNames, jsonObject,[],false)

}

function myFunction3() {
  var imageFolders = [];
  var imagesAndNames = [];
  jsonObject = getJSON();
  allArticleNames = getArticlesAndSubItemNamesFromDoc();
  imageFolders = getImageFileLocations(jsonObject);
  imagesAndNames = getAllFileIdsByNameAndFolder(imageFolders);
  pushAllDataToSheet(allArticleNames, jsonObject,imagesAndNames,true)

}


function myFunction4() {
  jsonObject = getJSON();
  allArticleNames = getArticlesAndSubItemNamesFromDoc();
  validateArticle("onboarding_day_chat", allArticleNames, jsonObject,[],false,true)
}

function myFunction5() {
  var imageFolders = [];
  var imagesAndNames = [];
  jsonObject = getJSON();
  allArticleNames = getArticlesAndSubItemNamesFromDoc();
  imageFolders = getImageFileLocations(jsonObject);
  imagesAndNames = getAllFileIdsByNameAndFolder(imageFolders);
  validateAllArticlesAndGetLog(allArticleNames,jsonObject,imagesAndNames,true,true);
}