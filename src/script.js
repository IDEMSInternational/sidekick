function doGet() {
  var template = HtmlService.createTemplateFromFile("index");

  return template
    .evaluate() // evaluate MUST come before setting the sandbox mode
    .setTitle("Sidekick")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME); //Also NATIVE
};

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};

function showSidebar() {
  var html = doGet();//HtmlService.createHtmlOutputFromFile('side2');
     // .setTitle('My custom sidebar');

  DocumentApp.getUi().showSidebar(html)
}

function onOpen(e){
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Show Sidebar', 'showSidebar')
    .addSeparator()
    .addItem('Import Data', 'importDataFormSpreadsheet')
    .addSeparator()
    .addItem('Create Demo Data', 'createDemoData')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
} 

function showError(error){
  var ui = DocumentApp.getUi();
  ui.alert(
     'Error',
     error,
      ui.ButtonSet.OK);
}


function importDataFormSpreadsheet(){
  var ui = DocumentApp.getUi();
  var response = ui.alert(
     'Confirm',
     'This will overwrite all existing data in the document. Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES){
    pullAllDataFromSheet();
  }
}

function createDemoData(){
  var ui = DocumentApp.getUi();
  var response = ui.alert(
     'WARNING',
     'This will create demo data including a new SHEET. It will DELETE all data in the document. Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES){
    setupDemoData();
  }
}