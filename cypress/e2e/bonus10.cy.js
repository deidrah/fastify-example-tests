/// <reference types="cypress" />

it('sets a common header on all requests', () => {
  // create a random number between 1e5 and 1e6
  // using Cypress._.random function
  const id = Cypress._.random(1e5, 1e6)
  const requestId = `req-${id}`
  // intercept all requests and add a custom header
  // https://on.cypress.io/intercept
  cy.intercept('*', (req) => {
    // set the header "request-id"
    // it will be used by our Fastify server
    // to log the requests
    req.headers['request-id'] = requestId
  })

  // also intercept the document or style or Ajax requests
  // and give them an alias to wait later
  cy.intercept('GET', '/').as('doc')
  cy.intercept('GET', '/fruit').as('fruit')
  // visit the page using https://on.cypress.io/visit
  cy.visit('/')
  // wait for the observed request(s)
  // and confirm the response header "x-request-id"
  // sent by the server back is the same as our
  // request ID we set above
  cy.wait('@doc')
    .its('response.headers')
    .should('have.property', 'x-request-id', requestId)
  cy.wait('@fruit')
    .its('response.headers')
    .should('have.property', 'x-request-id', requestId)
})