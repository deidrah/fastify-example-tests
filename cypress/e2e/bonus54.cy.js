/// <reference types="cypress" />

it('uploads a JSON file using a form', () => {
  // visit the page "/upload-json-file.html"
  // https://on.cypress.io/visit
  cy.visit('/upload-json-file.html')
  // find the file input element with the name "json-file"
  // and select the JSON fixture file "apple.json"
  // https://on.cypress.io/selectfile
  cy.get('input[type=file][name=json-file]').selectFile(
    'cypress/fixtures/apple.json',
  )
  // find the button with the text "Submit"
  // and click it
  // https://on.cypress.io/contains
  // https://on.cypress.io/click
  cy.contains('button', 'Submit').click()
  // confirm the URL changes to /upload-json-file
  cy.location('pathname').should(
    'equal',
    '/upload-json-file',
  )
  // confirm the server has received out JSON file
  // by checking the response HTML elements:
  // the page heading, the filename, the JSON output
  // Tip: you probably will need to load the fixture "apple.json"
  cy.contains('h2', 'Uploaded JSON file')
  cy.contains('h3[data-cy=filename]', 'apple.json')
  cy.fixture('apple.json')
    .then((json) => JSON.stringify(json, null, 2))
    .then((text) => {
      cy.contains('pre', text)
    })
})

it('uploads a JSON file using a cy.request', () => {
  // create a new instance of FormData
  const formData = new FormData()
  // load the fixture "apple.json"
  // https://on.cypress.io/fixture
  cy.fixture('apple.json')
    // convert it to JSON and create a Blob
    // using Cypress.Blob.createBlob method
    // Tip: the 2nd argument should be "application/json"
    .then((json) => JSON.stringify(json, null, 2))
    .then((text) =>
      Cypress.Blob.createBlob([text], 'application/json'),
    )
    .then((blob) => {
      // set the blob in the form under the form field name
      // Tip: don't forget to give the filename
      formData.set('json-file', blob, 'pear.json')
    })
  // post the form to "/upload-json-file" endpoint
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/upload-json-file',
    body: formData,
  })
    // grab the response body
    // https://on.cypress.io/its
    .its('body')
    // and convert it from ArrayBuffer to Buffer
    .then(Cypress.Buffer.from)
    // convert the buffer to a string
    // https://on.cypress.io/invoke
    .invoke('toString', 'utf8')
    // and write the string to the current HTML document
    // https://on.cypress.io/document
    .then((html) => {
      cy.document().invoke('write', html)
    })
  // confirm the server has received out JSON file
  // by checking the response HTML elements:
  // the page heading, the filename, the JSON output
  cy.contains('h2', 'Uploaded JSON file')
  cy.contains('h3[data-cy=filename]', 'pear.json')
  cy.contains('pre', '"fruit": "apple"')
})