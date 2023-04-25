// <reference types="Cypress" />

it('modifies the outgoing request', () => {
  // visit the page "calculator.html"
  // https://on.cypress.io/visit
  cy.visit('/calculator.html')
  // intercept the "POST /calculate" calls
  // look at the request body and multiply
  // the "a" and "b" arguments by 100
  cy.intercept('POST', '/calculate', (req) => {
    req.body.a *= 100
    req.body.b *= 100
  })
  // type "2" into the input #num1
  // type "3" into the input #num2
  // https://on.cypress.io/get
  // https://on.cypress.io/type
  cy.get('#num1').type('2')
  cy.get('#num2').type('3')
  // click the "add" button
  // https://on.cypress.io/click
  cy.get('#add').click()
  // confirm the answer shown is 500
  cy.contains('#answer', '500')
})