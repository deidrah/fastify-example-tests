/// <reference types="cypress" />

it('waits for a successful message', () => {
  // visit the page /retries.html
  // https://on.cypress.io/visit
  cy.visit('/retries.html')
  // confirm that it contains an element with id "result"
  // first with the text "FAIL 1"
  // then with the text "FAIL 2"
  // and then with the text "SUCCESS"
  // https://on.cypress.io/contains
  cy.contains('#result', 'FAIL 1')
  cy.contains('#result', 'FAIL 2')
  cy.contains('#result', 'OK')
})

// add a custom Cypress command to wait for a successful response
// given an alias. The command should log "Success" if the response
// status code is 200. Otherwise it should keep waiting
// for the same alias. What does the command yield?
// Can you make it yield the status code? Or the intercept?
// https://on.cypress.io/custom-commands
Cypress.Commands.add('waitForSuccess', (alias, n = 3) => {
  // stop the test if we ran out of attempts "n"
  if (n === 0) {
    throw new Error('Failed to wait for success')
  }

  return cy
    .wait(alias)
    .its('response.statusCode')
    .then((statusCode) => {
      if (statusCode < 300) {
        cy.log('Success')
        cy.wrap(statusCode)
        return
      }
    
      return cy.waitForSuccess(alias, n - 1)
    })
})

it('waits until a successful response using a custom command', () => {
  // spy on the GET /unreliable request
  // and give it an alias "unreliable"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/unreliable').as('unreliable')
  // visit the page /retries.html
  // https://on.cypress.io/visit
  cy.visit('/retries.html')
  // call the custom command waitForSuccess
  // and confirm that it yields the value 200
  cy.waitForSuccess('@unreliable').should('equal', 200)
})