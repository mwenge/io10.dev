export function savePipelineToGoogleDrive(zipFile, zipFileName, running) {
  running.textContent = "Signing into Google";
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    gapi.auth2.getAuthInstance().signIn();
  }
/*
	// Get the folder ID for 'io10' and store the zip in that.
	let folderName = "io10";
	let result = await gapi.client.drive.files.list({
			q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
			fields: 'nextPageToken, files(id, name)',
			spaces: 'drive',
	});
	let folder = result.result.files.filter(x => x.name === folderName);
	var folderId = folder.length?folder[0].id:0;
	// 'io10' folder doesn't exist: create it.
	if (!folderId) {
		var fileMetadata = {
			'name': 'io10',
			'mimeType': 'application/vnd.google-apps.folder'
		};
		let createResult = await gapi.client.drive.files.create({
			resource: fileMetadata,
			fields: 'id'
		});
		console.log('Folder Id: ', createResult);
		folderId = createResult.id;
	}
*/
	// Store the zip file.
	var file = new Blob([zipFile], {type: 'application/zip'});
	var metadata = {
			'name': zipFileName, // Filename at Google Drive
			'mimeType': 'application/zip', // mimeType at Google Drive
			//'parents': [folderId], // Folder ID at Google Drive
	};

  running.textContent = "Uploading to Google";
	var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
	var form = new FormData();
	form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
	form.append('file', file);

	fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
			method: 'POST',
			headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
			body: form,
	}).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        running.textContent = `Saved '${zipFileName}' to Google Drive`;
        return response.json();
      } else {
        throw Error(response.statusText);
      }
  }).catch((error) => {
      running.textContent = `Error Saving '${zipFileName}' to Google Drive: ${error}`;
	});
}

