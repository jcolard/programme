/**
 * Google Apps Script pour la synchronisation du calendrier Day Scheduler
 * Fichier cible Google Drive : https://drive.google.com/file/d/1tMm3y6prKb251h2Hq70rUt0ehfGWt2kB/view
 */

const FILE_ID = '1tMm3y6prKb251h2Hq70rUt0ehfGWt2kB';

/**
 * Endpoint GET : Récupère le contenu actuel du fichier JSON sur Google Drive
 */
function doGet(e) {
  try {
    const file = DriveApp.getFileById(FILE_ID);
    const content = file.getBlob().getDataAsString();
    
    return ContentService
      .createTextOutput(content)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: true, 
        message: err.message || err.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint POST : Met à jour le contenu du fichier JSON sur Google Drive
 */
function doPost(e) {
  try {
    let payload = '';
    if (e && e.postData && e.postData.contents) {
      payload = e.postData.contents;
    } else {
      throw new Error("Aucun contenu reçu dans la requête POST");
    }

    // Validation du format JSON
    JSON.parse(payload);

    const file = DriveApp.getFileById(FILE_ID);
    file.setContent(payload);

    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        timestamp: new Date().toISOString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: err.message || err.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
