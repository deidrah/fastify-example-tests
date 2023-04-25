/// <reference types="cypress" />

// cypress/integration/bonus38.js
import { recurse } from 'cypress-recurse'

// This is another take on the bonus31 spec

// the page /lucky7.html fetches a random digit every second
// until it gets {n: 7} response from the server and then stops
// This test checks all calls to the "GET /random-digit" intercept
// and stops when any of them have the response {n: 7}
it('checks the intercepts until it gets the right response', () => {
  cy.intercept('GET', '/random-digit').as('random')
  //
  // visit the "lucky7.html" page
  cy.visit('/lucky7.html')

  // get all network intercepts for the alias "@random"
  // check if any of them have response object with "n: 7" property
  // wait up to 30 seconds, check every second
  // tip: use cypress-recurse
  recurse(
    () => cy.get('@random.all'),
    (intercepts) =>
      intercepts.some((x) => x.response.body.n === 7),
    {
      timeout: 30_000,
      delay: 1000,
      log: 'found n=7',
    },
  )

  // once we have confirmed the network call with "n: 7",
  // the page is showing 7 immediately
  // which we can verify using cy.contains with a very short timeout
  cy.contains('#number', '7', { timeout: 100 }).should(
    'be.visible',
  )
})

it('Alternative: use a single cy.wait', () => {
  // we can set up an intercept
  cy.intercept('GET', '/random-digit').as('random')
  // visit the page
  cy.visit('/lucky7.html')
  // use "recurse" to wait for the "GET /random-digit"
  // network call and yield the response from the server
  // Our predicate should return true when the server
  // returns n = 7
  recurse(
    () => {
      return cy.wait('@random').its('response.body.n')
    },
    (n) => n === 7,
    {
      timeout: 70_000,
      delay: 1000,
      limit: 70,
      log: 'found n=7',
    },
  )
  // once we have confirmed the network call with "n: 7",
  // the page is showing 7 immediately
  // which we can verify using cy.contains with a very short timeout
  cy.contains('#number', '7', { timeout: 100 }).should(
    'be.visible',
  )
})