let clientId =
  '772941012173 - bvsfoseddvdad69snafsbr86h7njdhce.apps.googleusercontent.com'
let apiKey = 'GOCSPX - gTdEXgAnlK9XPelALsr3ezEVXNfm'
let scopes = 'https://www.googleapis.com/auth/spreadsheets'

function handleClientLoad () {
  gapi.load('client:auth2', initClient)
}

function initClient () {
  gapi.client
    .init({
      apiKey: apiKey,
      clientId: clientId,
      discoveryDocs: [
        'https://sheets.googleapis.com/$discovery/rest?version=v4'
      ],
      scope: scopes
    })
    .then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus)
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    })
}

function handleSignInClick () {
  gapi.auth2.getAuthInstance().signIn()
}

function handleSignOutClick () {
  gapi.auth2.getAuthInstance().signOut()
}

function updateSignInStatus (isSignedIn) {
  if (isSignedIn) {
    createSheet()
  } else {
    console.log('Please sign in to create a sheet')
  }
}

function createSheet () {
  gapi.client.sheets.spreadsheets
    .create({
      properties: {
        title: 'New Sheet'
      }
    })
    .then(response => {
      let sheetId = response.result.spreadsheetId
      console.log('Created sheet with ID:', sheetId)
      addRows(sheetId)
    })
}

function addRows (sheetId) {
  let values = [
    ['Name', 'Age'],
    ['John Doe', '30'],
    ['Jane Doe', '25']
  ]
  let body = {
    values: values
  }
  gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:B3',
      valueInputOption: 'RAW',
      resource: body
    })
    .then(response => {
      console.log('Rows added:', response.result.updates)
    })
}
