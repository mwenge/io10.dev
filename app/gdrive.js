async function get(file) {
	var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

  let result = null;
  try {
    let response = await fetch('https://www.googleapis.com/drive/v3/files/' + file.id + '?alt=media', {
        method: 'GET',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken })});
    if (response.status >= 200 && response.status <= 299) {
      result = await response.blob();
    } else {
      throw Error(response.statusText);
    }
  } catch(error) {
      running.textContent = `Error getting '${file.name}' to Google Drive: ${error}`;
  }
  console.log(`get '{$file}'`, result);
  return result;
}

async function update(id, file, metadata) {
  running.textContent = "Uploading to Google";
	var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
	var form = new FormData();
	form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
	form.append('file', file);

  let result = null;
  try {
    let response = await fetch('https://www.googleapis.com/upload/drive/v3/files/' + id + '?uploadType=multipart', {
        method: 'PATCH',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form });
    if (response.status >= 200 && response.status <= 299) {
      running.textContent = `Updated '${metadata.name}' on Google Drive`;
      result = await response.json();
    } else {
      throw Error(response.statusText);
    }
  } catch(error) {
    running.textContent = `Error Updating '${metadata.name}' on Google Drive: ${error}`;
    console.log(error);
  }
  return result;
}
async function create(file, metadata) {
	var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
	var form = new FormData();
	form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
	form.append('file', file);

  let result = null;
  try {
    let response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form });
    if (response.status >= 200 && response.status <= 299) {
      running.textContent = `Created '${metadata.name}' on Google Drive`;
      result = await response.json();
    } else {
      throw Error(response.statusText);
    }
  } catch(error) {
    running.textContent = `Error Creating '${metadata.name}' on Google Drive: ${error}`;
    console.log(error);
  }
  return result;
}

async function blobToText(blob) {
  let t = null;
  try {
    t = await blob.text();
  } catch(e) {
      throw Error(e);
  }
  return t;

}
async function getFileManifest() {
	let result = await gapi.client.drive.files.list({
			fields: 'nextPageToken, files(id, name)',
			spaces: 'drive',
      pageSize: 100,
	});
  console.log('Raw File List', result.result.files);
	let fileList = result.result.files.filter(x => x.name === "io10-manifest.json");
  console.log('fileList', fileList);
  if (fileList.length) {
    let file = fileList[0];
    return {id: file.id, content: await blobToText(await get(file))};
  }
	// 'io10' folder doesn't exist: create it.
  const defaultContent = "{}";
	var file = new Blob([defaultContent], {type: 'application/zip'});
	var metadata = {
    'name': 'io10-manifest.json',
    'mimeType': 'application/json', // mimeType at Google Drive
	};
  result = await create(file, metadata);
  console.log('upload manifest result', result);
  return {id: result ? result.id : null, content: defaultContent};
}

export async function savePipelineToGoogleDrive(zipFile, zipFileName, running) {
  running.textContent = "Signing into Google Drive";
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    gapi.auth2.getAuthInstance().signIn();
  }
  let fileManifest = await getFileManifest();
  console.log("file manifest", await getFileManifest());
  if (!fileManifest.id) {
    running.textContent = "Failed to get list of files on Google Drive";
    return;
  }
  running.textContent = "Uploading to Google Drive";
	// Store the zip file.
	var file = new Blob([zipFile], {type: 'application/zip'});
	var metadata = {
			'name': zipFileName, // Filename at Google Drive
			'mimeType': 'application/zip', // mimeType at Google Drive
			//'parents': [folderId], // Folder ID at Google Drive
	};
  let manifestContent = JSON.parse(fileManifest.content);
  if (manifestContent[zipFileName]) {
    let result = await update(manifestContent[zipFileName], file, metadata);
    console.log(`update ${zipFileName} result`, result);
    return;
  }
  let result = await create(file, metadata);
  console.log(`upload ${zipFileName} result`, result);

  manifestContent[zipFileName] = result.id;
	metadata = {
    'name': 'io10-manifest.json',
    'mimeType': 'application/json', // mimeType at Google Drive
	};
  result = await update(fileManifest.id, JSON.stringify(manifestContent), metadata);
  console.log(`update manifest result`, result);
}

