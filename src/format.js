function formatSubTable(table){
  table.setBorderColor(fieldTableBorderColour);
  table.setColumnWidth(0, fieldColumnSize);

  for (var i = 0; i < table.getNumRows(); i++) {
    table.getCell(i,0).setAttributes(columnNameStyle());
    table.getCell(i,1).setAttributes(variableStyle());
  }
}