


function getArticleNamesFormDoc(){
  var doc = DocumentApp.getActiveDocument();  
  var body = doc.getBody();
  deleteAllBlankHeading1s(body);
  var paragraphs = body.getParagraphs();  
  var articles = [];
  for (var i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].getHeading() === DocumentApp.ParagraphHeading.HEADING1) {
      articles.push(paragraphs[i].getText());
    }
  }
  return articles;
}

function deleteAllBlankHeading1s(body){
  var paragraphs = body.getParagraphs();  
  for (var i = paragraphs.length -1; i >=0 ; i--) {
    if (paragraphs[i].getHeading() === DocumentApp.ParagraphHeading.HEADING1) {
      if (paragraphs[i].getText().trim() == "") {
        paragraphs[i].removeFromParent();
      }
    }
  }
}

function getSectionFields(section){
  var fields = [];
  fields.push({"field":section.foreign_key,"type":"foreign_key"});
   for (var key in section.fields) {
    if (section.fields.hasOwnProperty(key)) {
      var field = section.fields[key];
      var name = field.name;
      if (name) {
        fields.push({"field":name, "type": field.type});
      }
    }
  }
  return fields
}

function getSubTableData(fields,values){
  var tableData = [];

  for (var key in fields) {
    if (fields.hasOwnProperty(key)) {
      var field = fields[key];
      if (field.type !== "foreign_key"){
        tableData.push([field.field,values[field.field]]);
      }
    }
  }
  return tableData
}

function getArticleFields(jsonObject){
  var fields = [];
  fields.push({"field":jsonObject.article_id,"type":"id"});
  fields.push({"field":jsonObject.status,"type":"text"});
  fields.push({"field":jsonObject.group,"type":"text"});
  for (var key in jsonObject.fields) {
    if (jsonObject.fields.hasOwnProperty(key)) {
      var field = jsonObject.fields[key];
      var name = field.name;
      if (name) {
        fields.push({"field":name, "type": field.type});
      }
    }
  }
  return fields
}

function getArticleFieldsWithoutId(articleFields){
  //This is due to not wanting to display the id in the table
  //they may be a better way to do this
  var fields = [];
  for (var key in articleFields) {
    if (articleFields.hasOwnProperty(key)) {
      var field = articleFields[key];
      if (field.type !== "id"){
        fields.push(field);
      }
    }
  }
  return fields
}

function getArticleStartPosition(body, startPostion, numberOfElements, articleName){
  for (var i = startPostion; i < numberOfElements; i++){
    var element = body.getChild(i);
    if (isArticleHeader(element) && (element.getText() == articleName)){
      return i;
  } 
  };
  //show error - try refreshng
  return -1
}


function getIdForFirstTable(body){
  var numChildren = body.getNumChildren();
  for (var i = 0; i < numChildren; i++){
    var element = body.getChild(i);
    if (element.getType() === DocumentApp.ElementType.TABLE){
      return i;
    }
  }
  return -1;
}

