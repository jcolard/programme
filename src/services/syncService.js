// Service pour la synchronisation Cloud via Google Apps Script Web App

export const DEFAULT_APPS_SCRIPT_URL = '';

/**
 * Envoie l'intégralité des données (les 3 jours types + configuration) vers le Google Drive via Apps Script
 * @param {string} scriptUrl - URL de l'application Web Apps Script (/exec)
 * @param {object} appData - Objet complet de l'application à sauvegarder
 */
export async function uploadToDrive(scriptUrl, appData) {
  if (!scriptUrl || !scriptUrl.trim()) {
    throw new Error("L'URL du Google Apps Script n'est pas configurée.");
  }

  const payload = JSON.stringify(appData, null, 2);

  // Utilisation de text/plain pour éviter le blocage CORS preflight (OPTIONS) avec Google Apps Script
  const response = await fetch(scriptUrl.trim(), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: payload,
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Erreur réseau (${response.status}) lors de l'envoi.`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error || result.message || 'Erreur lors de la sauvegarde sur Drive.');
  }

  return result;
}

/**
 * Récupère le contenu actuel du fichier JSON sur Google Drive via Apps Script
 * @param {string} scriptUrl - URL de l'application Web Apps Script (/exec)
 */
export async function downloadFromDrive(scriptUrl) {
  if (!scriptUrl || !scriptUrl.trim()) {
    throw new Error("L'URL du Google Apps Script n'est pas configurée.");
  }

  const response = await fetch(scriptUrl.trim(), {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Erreur réseau (${response.status}) lors de la récupération.`);
  }

  const data = await response.json();
  if (data && data.error) {
    throw new Error(data.message || 'Erreur lors de la lecture du fichier Drive.');
  }

  return data;
}
