// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
var apiKey = 'AIzaSyDAJMKenlcYQjhQnt6o8yhaWWiIH2De_Yo';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
var clientId = '1026743788615-mic0188b618am7ln8q76blu9pilt1ic9.apps.googleusercontent.com';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
var scopes = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata';

function handleClientLoad() {
  // Load the API client and auth2 library
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: apiKey,
    discoveryDocs: discoveryDocs,
    clientId: clientId,
    scope: scopes,
  });
}

