/// <reference types="cypress" />

it('looks up the redirection target', () => {
  // use cy.request command to look up "/short-url"
  // https://on.cypress.io/request
  // from the yielded object grab the "allRequestResponses" list
  // and confirm it is an array and is not empty
  cy.request('/short-url')
    // Tip: use console.log to print the current subject
    // at each step of the command chain
    .then(console.log)
    // you can use "redirects" list
    // but you must parse the "code: URL"
    .its('allRequestResponses')
    .should('be.an', 'array')
    .and('not.be.empty')
    // Then grab the last object in the list - this is the final URL
    // (but you will need to extract the right property)
    .invoke('at', -1)
    .its('Request URL')
    .should('be.a', 'string')
    // use cy.visit to visit the final resolved URL
    // and confirm it shows "H1 Redirected"
    .then(cy.visit)
  cy.contains('h1', 'Redirected')
})