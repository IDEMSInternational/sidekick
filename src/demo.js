  


function createDemoSheet() {
  const sheet = SpreadsheetApp.create('IDEMS Sidekick Demo');
  const sheetNames = ['docJSON', 'modules', 'sub_items', 'sections'];
  sheetNames.forEach((name, index) => {
    if (index === 0) {
      sheet.getActiveSheet().setName(name);
    } else {
      sheet.insertSheet(name);
    }
  });

  filldocJSON(sheet);
  fillmodules(sheet);
  fillsubItems(sheet);
  fillsections(sheet);

  return sheet.getId();
}


function filldocJSON(sheet){
  const jsonData = {
    "article_id": "id",
    "status": "status",
    "group": "tag_list",
    "sheet":"modules", 
        "asset_folders": [
        ],
    "fields": [
        {
            "type": "text",
            "name": "title"
        },
        {
            "type": "asset",
            "name": "image_asset"
        },
        {
            "type": "text",
            "name": "description"
        }
    ],
        "sub_item":{
                        "sub_item_id": "id",
                        "name": "page",
                        "sheet": "sub_items",
                        "foreign_key": "foreign_key"
        },
    "sections": [
        {
            "name": "section",
            "type": "content",
                        "sheet": "sections",
                        "foreign_key": "foreign_key",
            "fields": [
                {
                    "type": "text",
                    "name": "title"
                },
                {
                    "type": "text",
                    "name": "text"
                }
            ]
        }       
    ]
  }
  const tab = sheet.getSheetByName('docJSON');
  tab.getRange('A1').setValue(JSON.stringify(jsonData, null, 2));
}

function fillmodules(sheet){
  const tab = sheet.getSheetByName('modules');
  tab.getRange('A1').setValue("id");
  tab.getRange('B1').setValue("title");
  tab.getRange('C1').setValue("image_asset");
  tab.getRange('D1').setValue("description");
  tab.getRange('E1').setValue("tag_list");
  tab.getRange('F1').setValue("status");
}
function fillsubItems(sheet){
  const tab = sheet.getSheetByName('sub_items');
  tab.getRange('A1').setValue("id");
  tab.getRange('B1').setValue("foreign_key");
}

function fillsections(sheet){
  const tab = sheet.getSheetByName('sections');
  tab.getRange('A1').setValue("id");
  tab.getRange('B1').setValue("foreign_key");
  tab.getRange('C1').setValue("title");
  tab.getRange('D1').setValue("text");
}


function createInitialTable(sheetID){
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.clear();

  // Create a 2x2 table
  const table = body.appendTable([
    ['METADATA', ''],
    ['sheet', sheetID]
  ]);

  //table.setBorderWidth(1);
}


function setupDemoData() {
  
  createInitialTable(createDemoSheet())

}


