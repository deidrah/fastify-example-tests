/// <reference types="cypress" />

// We can override the entire site if we want to
// or some static resources. In this example,
// let's replace the "index.html" and "style.css"
// We can override the entire site if we want to
// or some static resources. In this example,
// let's replace the "index.html" and "style.css"
it('mocks the entire site', () => {
  // intercept loading the document "/" and return
  // the fixture "cypress/fixtures/public/index.html"
  // Give the document intercept an alias "doc"
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/', {
    fixture: 'public/index.html',
  }).as('doc')
  // intercept loading the resource "style.css" and return
  // the fixture "cypress/fixtures/public/style.css"
  // Give the CSS intercept an alias "style"
  cy.intercept('GET', 'style.css', {
    fixture: 'public/style.css',
  }).as('style')
  // visit the site using https://on.cypress.io/visit
  cy.visit('/')
  // confirm the browser has received the HTML document response
  // with the correct content type
  // https://on.cypress.io/wait
  // https://on.cypress.io/its
  // with assertion "have.property" to check a property in an object
  cy.wait('@doc')
    .its('response.headers')
    .should('have.property', 'content-type', 'text/html')
  // confirm the browser has received the style response
  // and the response had the correct content type
  cy.wait('@style')
    .its('response.headers')
    .should('have.property', 'content-type', 'text/css')
})