/// <reference types="cypress" />

// overwrite the cy.intercept command to log a message
// to the Cypress Command Log when the intercept is defined
Cypress.Commands.overwrite(
  'intercept',
  (intercept, method, url, options) => {
    cy.log(`**adding intercept** ${method} ${url}`).then(
      () => {
        return intercept(method, url, options)
      },
    )
  },
)

it('registers the intercept too late', () => {
  // visit the calculator page and add two numbers
  cy.visit('/calculator.html')
  cy.get('#num1').type('10')
  cy.get('#num2').type('20')
  // to fix the test, define an intercept
  // before clicking the "add" button
  cy.intercept('POST', '/calculate').as('calculate')
  cy.get('#add').click()
  // confirm the "POST /calculate" call is made
  cy.wait('@calculate')
})