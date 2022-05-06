async function get(file) {
	var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

  let result = null;
  try {
    let response = await fetch('https://www.googleapis.com/drive/v3/files/' + file.id + '?alt=media', {
        method: 'GET',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken })});
    if (response.status >= 200 && response.status <= 299) {
      result = response;
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

async function getFileID(name) {
	let result = await gapi.client.drive.files.list({
			fields: 'nextPageToken, files(id, name)',
			spaces: 'drive',
      pageSize: 100,
	});
  console.log('Raw File List', result.result.files);
	let fileList = result.result.files.filter(x => x.name === name);
  console.log('fileList', fileList);
  if (fileList.length) {
    let file = fileList[0];
    return file.id;
  }
  return null;
}

export async function savePipelineToGoogleDrive(zipFile, zipFileName, running) {
  running.textContent = "Signing into Google Drive";
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    await gapi.auth2.getAuthInstance().signIn();
  }
  let fileID = await getFileID(zipFileName);
  running.textContent = "Uploading to Google Drive";
	// Store the zip file.
	var file = new Blob([zipFile], {type: 'application/zip'});
	var metadata = {
			'name': zipFileName, // Filename at Google Drive
			'mimeType': 'application/zip', // mimeType at Google Drive
			//'parents': [folderId], // Folder ID at Google Drive
	};
  if (fileID) {
    let result = await update(fileID, file, metadata);
    console.log(`update ${zipFileName} result`, result);
    return;
  }
  let result = await create(file, metadata);
  console.log(`upload ${zipFileName} result`, result);
}

async function getFileList() {
	let result = await gapi.client.drive.files.list({
			fields: 'nextPageToken, files(id, name)',
			spaces: 'drive',
      pageSize: 100,
	});
  console.log('Raw File List', result.result.files);
	let fileList = result.result.files;
  console.log('getFileList', fileList);
  if (fileList.length) {
    return fileList;
  }
  return null;
}
export async function loadPipelinesFromGoogleDrive(loadZipFile) {
  running.textContent = "Signing into Google Drive";
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    let result = await gapi.auth2.getAuthInstance().signIn();
    console.log("signin", result);
  }
  let fileList = await getFileList();
  if (!fileList) {
    running.textContent = "No files to load on Google Drive";
    return;
  }
  running.innerHTML = "Loading from Google Drive..<br>";
  await fileList.forEach(async (f) => {
    let response = await get(f);
    let buf = await response.arrayBuffer();
    let result = await loadZipFile(buf);
    if (!result) {
      running.innerHTML += `Failed to load ${f.name} from Google Drive<br>`;
    } else {
      running.innerHTML += `Loaded ${f.name} from Google Drive<br>`;
    }
  });
}

