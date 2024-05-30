function deleteFromDocument(body,startId, finishId){  
  if (startId > finishId){
    Logger.log("Error: deleteFromDocument start > finish");
    return;
  }
  var numChildren = body.getNumChildren();
  var deleteElements = []
  for (var i = startId; i < finishId; i++){
    deleteElements.push(body.getChild(i));
  }
  deleteElements.forEach(function(element) {
    element.removeFromParent();
  });
}


