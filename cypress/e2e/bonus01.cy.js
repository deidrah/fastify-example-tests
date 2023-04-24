/// <reference types="cypress" />

// Bonus 1: the server implements the /fruits endpoint
// which can return zero, one, or many fruits
// The page fruits.html shows the returned fruits.
// and should handle any number of returned results.
//
// How do we test this? The chances of returning zero fruits
// are slim... but we want to make sure the page doesn't crash

// this test should check whatever the server returns
// by spying on the network call
it('shows zero fruits', () => {
  // instead of reloading the page and sometimes (very rarely)
  // getting zero fruits returned
  // let's stub the response from the server
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruits', [])
  // then visit the page /fruits.html
  // https://on.cypress.io/visit
  cy.visit('/fruits.html')
  // confirm there are no fruits
  // https://on.cypress.io/contains
  cy.contains('#fruits', 'No fruits')
})

it('shows two fruits', () => {
  // let's stub the response from the server
  // and return two fruits: apples and kiwi
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruits', ['apples', 'kiwi'])
  // then visit the page /fruits.html
  // https://on.cypress.io/visit
  cy.visit('/fruits.html')
  // confirm there are two fruits
  cy.get('#fruits li').should('have.length', 2)
  // https://on.cypress.io/contains
  cy.contains('#fruits', 'apples')
  cy.contains('#fruits', 'kiwi')
})