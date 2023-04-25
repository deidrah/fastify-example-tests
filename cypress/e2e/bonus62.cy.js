/// <reference types="cypress" />

it('includes the fruit Apples in the response array of objects', () => {
  // spy on the "GET /all-fruits" call and give it an alias "all-fruits"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/all-fruits').as('all-fruits')
  // visit the page "/all-fruits.html"
  // https://on.cypress.io/visit
  cy.visit('/all-fruits.html')
  // wait for the "all-fruits" network call
  // https://on.cypress.io/wait
  cy.wait('@all-fruits')
    // and yield its response body
    // https://on.cypress.io/its
    .its('response.body')
    // find in that list an object with "fruit: Apples" property
    // and yield it to the next assertions
    // Tip: use Lodash _.find method
    // https://lodash.com/docs
    .then((list) =>
      Cypress._.find(list, { fruit: 'Apples' }),
    )
    // confirm the found item is an object
    .should('be.an', 'object')
    // and confirm the item has property "k: 0"
    .and('have.property', 'k', 0)
  // confirm the "Apples" is shown at the first position
  // in the list on the page
  // https://on.cypress.io/contains
  cy.contains('#fruits li:first', 'Apples')
})