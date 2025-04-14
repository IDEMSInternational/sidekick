function columnNameStyle(){
  var style = {};
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
  DocumentApp.HorizontalAlignment.RIGHT;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto Mono';
  style[DocumentApp.Attribute.FONT_SIZE] = 10;
  style[DocumentApp.Attribute.BOLD] = true;
  style[DocumentApp.Attribute.BACKGROUND_COLOR] = '#ffffff'; //white
  return style;
}

function variableStyle(){
  var style = {};
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
  DocumentApp.HorizontalAlignment.RIGHT;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
  style[DocumentApp.Attribute.FONT_SIZE] = 11;
  style[DocumentApp.Attribute.BOLD] = false;
  return style;
}

function sectionStyle(){
  var style = {};
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
  DocumentApp.HorizontalAlignment.CENTER;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
  style[DocumentApp.Attribute.FONT_SIZE] = 14;
  style[DocumentApp.Attribute.BOLD] = true;
  return style;
}

function columnNameInvalidStyle(){
  var style = {};
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
  DocumentApp.HorizontalAlignment.RIGHT;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto Mono';
  style[DocumentApp.Attribute.FONT_SIZE] = 10;
  style[DocumentApp.Attribute.BOLD] = true;
  style[DocumentApp.Attribute.BACKGROUND_COLOR] = '#ff0000'; //red
  return style;
}

function validLinkStyle(){
  var style = {};
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
  DocumentApp.HorizontalAlignment.RIGHT;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
  style[DocumentApp.Attribute.FONT_SIZE] = 11;
  style[DocumentApp.Attribute.BOLD] = false;
  style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#006400'; //dark green
  return style;
}

function invalidLinkStyle(){
  var style = {};
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
  DocumentApp.HorizontalAlignment.RIGHT;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
  style[DocumentApp.Attribute.FONT_SIZE] = 11;
  style[DocumentApp.Attribute.BOLD] = false;
  style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#640000'; //dark red
  return style;
}

var fieldTableBorderColour = '#000000'; //black
var fieldTableInvalidBorderColour = '#ff0000'; //red

var outerTableBorderColour = '#ffffff'; //white
var outerTableInvalidBorderColour = '#ff0000'; //red

var imageSize = 80;

var fieldColumnSize = 70;

var subItemText = 'page_';
