function addSubTable(body,fields,values){ 
  var table = body.appendTable(getSubTableData(fields,values));
  formatSubTable(table);  
}

function insertSubTable(body,fields,values,index){
  var table = body.insertTable(index,getSubTableData(fields,values));
  formatSubTable(table);
}


function createBlankFields(fields){
  var rowsData = {};
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (field.type == "id"){
      rowsData[field.field] = "New Article"
    } else {
      rowsData[field.field] = "";
    }
  } 
  return rowsData;
}