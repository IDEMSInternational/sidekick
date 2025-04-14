var updateImages = false;

function getAllFileIdsByNameAndFolder(folderIds) {
  var filesAndIds = [];
  folderIds.forEach(function(folderId){
    try {
      searchFilesInFolder(folderId,""); 
    } catch(e) {
      console.log("Unable to access drive for folders: "+ folderIds + " error: " + e.message)
    }
  })
  
  return filesAndIds; 

  function searchFilesInFolder(folderId, folderName) {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      var fileNameWithPath = folderName + file.getName(); // Include folder name in file path
        var fileId = file.getId();
        filesAndIds.push({"filename" : fileNameWithPath, "id" : file.getId(), "image" : null});//file.getThumbnail().getBytes()});
    }
    var subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      var subfolder = subfolders.next();
      searchFilesInFolder(subfolder.getId(),folderName + subfolder.getName()+"/"); // Recursively search subfolders
    }
  }
}

//https://drive.google.com/thumbnail?id=1Jv72yjv8kCZLayiLcdoCmD_U5I0qrHzJ
function updateAsset(cell,assets){  
  var fileName = cell.getText().trim();
  if (fileName == ""){
    return
  } 
  var asset = findAsset(assets,fileName)
  if (asset){
    console.log("update images: " + updateImages)
    if (updateImages) {
      console.log("text: "+fileName)
      deleteImageFromCell(cell);  
    //  var imageBlob = bytesToBlob(asset.image);
      var imageBlob = fetchImageFromDrive(asset.id);
      var image = cell.insertImage(1,imageBlob);
      image.setHeight(imageSize);
      image.setWidth(imageSize);
    }
    cell.setAttributes(validLinkStyle());
  } else {
    cell.setAttributes(invalidLinkStyle());  
    logValidationError("Cannot find asset: "+ fileName)   
  }
}

function fetchImageFromDrive(assetId) {
  try {
    var url = `https://drive.google.com/thumbnail?id=${assetId}`;
    var response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true
    });
    if (response.getResponseCode() === 200) {
      return response.getBlob(); // Get the image blob from the response
    } else {
      console.error("Failed to fetch image. HTTP response code: " + response.getResponseCode());
      return null;
    }
  } catch (e) {
    console.error("Error fetching image from Drive: " + e.message);
    return null;
  }
}

function bytesToBlob(bytes) {
  var byteArray = new Uint8Array(bytes);
  return Utilities.newBlob(byteArray);
}

function deleteImageFromCell(cell){
  var text = cell.getText().trim();
  cell.clear();
  cell.setText(text)
}

function findAsset(assets,filename){
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].filename.toLowerCase().trim() == filename.toLowerCase().trim()) {
      return assets[i];
    }
  }
  return null; // Return null if the filename is not found in the list
}
