/// <reference types="cypress" />

// this test is similar to bonus42, but we can use
// the browser's FormData API to construct the request
it('makes a multipart/form-data cy.request using FormData', () => {
  // form values we want to submit
  // without going through the form on the page
  const fields = {
    city: 'New York City',
    value: 101,
  }

  // create a new instance of FormData
  // and set each field to upload
  const formData = new FormData()
  formData.set('city', fields.city)
  formData.set('value', fields.value)

  // make a POST request using https://on.cypress.io/request
  // to the endpoint "/submit-form" with the form data as the body
  // Note: cy.request encodes the multipart and sets
  // the content type with the boundary automatically
  cy.request({
    method: 'POST',
    url: '/submit-form',
    body: formData,
  })
    // if you inspect the "cy.request" in the CommandLog
    // and DevTools console, it uses ArrayBuffer to send the request
    // and receive the response.
    // From the response, grab the HTML body string
    // https://on.cypress.io/its
    // and convert it from ArrayBuffer to Buffer
    // before getting it as "utf8" text
    // https://on.cypress.io/invoke
    .its('body')
    // Tip: you can use "Buffer" utility bundled with Cypress
    // to immediately convert ArrayBuffer to Buffer
    // https://on.cypress.io/buffer
    .then(Cypress.Buffer.from)
    .invoke('toString', 'utf8')
    // then get the application's document object
    // https://on.cypress.io/document
    // because it is empty, we can write the HTML we got
    // into the document using document.write method
    .then((html) => {
      cy.document().invoke('write', html)
    })

  // the page should show "Thank you for the your submission"
  // and the submitted values, which we need to confirm
  cy.contains('Thank you for your submission')
  cy.contains('[data-city]', fields.city)
  cy.contains('[data-value]', fields.value)
})