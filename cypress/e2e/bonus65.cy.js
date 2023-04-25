/// <reference types="cypress" />

it('fails the test when an intercept fails', () => {
  // we have defined a network spy
  // that checks if the returned fruit is "Cucumber"
  // Note: the server NEVER returns the "Cucumber"
  // thus we expect this test to fail, right?!
  cy.intercept('GET', '/fruit', (req) => {
    req.continue((res) => {
      expect(res.body.fruit).to.equal('Cucumber')
    })
  }).as('fruit')
  // visit the "/" page, which should kick off
  // the application network call to get the fruit
  cy.visit('/')
  // force the test to wait until the network call finishes
  // and if the assertion in the cy.intercept callback fails,
  // then this test will fail too
  cy.wait('@fruit')
})

// https://github.com/bahmutov/cypress-expect-n-assertions
import { plan } from 'cypress-expect-n-assertions'

// Bonus: use cypress-expect-n-assertions to automatically wait for the assertion
it('fails the test when an intercept fails using assertion counting', () => {
  // there should be 1 assertion in this test
  plan(1)
  // we have defined a network spy
  // that checks if the returned fruit is "Cucumber"
  // Note: the server NEVER returns the "Cucumber"
  // thus we expect this test to fail, right?!
  cy.intercept('GET', '/fruit', (req) => {
    req.continue((res) => {
      expect(res.body.fruit).to.equal('Cucumber')
    })
  })
  // visit the "/" page, which should kick off
  // the application network call to get the fruit
  cy.visit('/')
})