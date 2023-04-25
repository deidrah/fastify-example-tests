/// <reference types="Cypress" />

it('makes 3 API calls to fetch the fruit', () => {
  // spy on the the calls to the "GET /fruit" calls
  // and give the intercept alias "fruit"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('/fruit').as('fruit')
  // visit the home page
  // https://on.cypress.io/visit
  cy.visit('/')
  // wait for the fruit to load
  // Tip: confirm the text "loading" is gone
  // https://on.cypress.io/contains
  cy.contains('loading').should('not.exist')
  // reload the page and confirm it loads a fruit
  // https://on.cypress.io/reload
  cy.reload()
  cy.contains('loading').should('not.exist')
  // again reload the page and confirm the fruit loads
  cy.reload()
  cy.contains('loading').should('not.exist')
  // get all fruit network calls and confirm
  // there were 3 network calls made by the application
  // https://on.cypress.io/get
  cy.get('@fruit.all').should('have.length', 3)
})