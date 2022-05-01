/// <reference types="cypress" />

it('fetches 10 fruits from the server', () => {
  // spy on the GET /fruit network call
  // and store each received fruit in a list
  const fruits = []
  cy.intercept('GET', '/fruit', (req) => {
    req.continue((res) => {
      fruits.push(res.body.fruit)
    })
  })
  cy.clock()
  cy.visit('/')
  cy.wrap(fruits).should('have.length', 1)
  // freeze the clock before visiting the page
  // confirm there is one fruit in the list after loading the page
  // advance the clock by 9 minutes
  cy.tick(590_000)
  // and confirm the list of fruits has 10 items
  cy.wrap(fruits)
    .should('have.length', 10)
    // and it includes "Oranges"
    .and('contain', 'Oranges')
})