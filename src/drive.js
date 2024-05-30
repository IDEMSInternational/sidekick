var updateImages = false;

function getAllFileIdsByNameAndFolder(folderIds) {
  var filesAndIds = [];
  folderIds.forEach(function(folderId){
    searchFilesInFolder(folderId,""); 
  })
  
  return filesAndIds; 

  function searchFilesInFolder(folderId, folderName) {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      var fileNameWithPath = folderName + file.getName(); // Include folder name in file path
   //   if (fileNameWithPath.toLowerCase().endsWith('.svg')) {
        var fileId = file.getId();
        filesAndIds.push({"filename" : fileNameWithPath, "id" : file.getId(), "image" : file.getThumbnail().getBytes()});///Utilities.base64Encode(file.getThumbnail().getBytes())});
   //   }
    }
    var subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      var subfolder = subfolders.next();
      searchFilesInFolder(subfolder.getId(),subfolder.getName()+"/"); // Recursively search subfolders
    }
  }
}

function updateAsset(cell,assets){  
  var fileName = cell.getText(); 
  var asset = findAsset(assets,fileName)
  if (asset){
    console.log("update images: " + updateImages)
    if (updateImages) {
      console.log("text: "+fileName)
      deleteImageFromCell(cell);  
      var imageBlob = bytesToBlob(asset.image);
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


