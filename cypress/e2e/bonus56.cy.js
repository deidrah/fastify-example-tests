/// <reference types="cypress" />

it('validates the referer header URL', () => {
  // spy on the network call the application makes
  // tip: use https://on.cypress.io/intercept
  // and give the intercept alias "fruit"
  // https://on.cypress.io/as
  cy.intercept('GET', '/fruit').as('fruit')
  // visit the page "/"
  // https://on.cypress.io/visit
  cy.visit('/')
  // wait for the network call to finish
  // https://on.cypress.io/wait
  cy.wait('@fruit')
    // grab the "referer" request header
    // https://on.cypress.io/its
    .its('request.headers.referer')
    // Tip: confirm it is a string to print it
    .should('be.a', 'string')
    // construct the URL instance from the string
    // https://developer.mozilla.org/en-US/docs/Web/API/URL
    .then((s) => new URL(s))
    // from the URL instance, we can grab multiple properties
    // that we can check. For example the "host"
    // is our base Url without the protocol
    .its('host')
    .should('equal', 'localhost:4200')
})