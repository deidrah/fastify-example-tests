/// <reference types="cypress" />

it('waits for the last network call', () => {
  // We want to visit the page "/calculator.html"
  // it might fire "POST /track" events
  // one, twice, or three times on load
  // before the visit, let's spy on POST /track
  // and the first call should always be the "load" event
  // https://on.cypress.io/intercept
  // In the intercept, inspect the response,
  // it should always have status code 200
  // and the body { ok: true }
  // Give the intercept the alias "track"
  cy.intercept('POST', '/track', (req) => {
    req.continue((res) => {
      expect(res.statusCode, 'status code').to.equal(200)
      expect(res.body, 'body').to.deep.equal({ ok: true })
    })
  }).as('track')
  // now visit the /calculator.html page
  cy.visit('/calculator.html')
  // confirm the h1 element has the text "Calculator"
  // https://on.cypress.io/contains
  cy.contains('h1', 'Calculator')
  // wait for the "track" alias and confirm the request
  // https://on.cypress.io/wait
  // https://on.cypress.io/its
  // Tip: you can use "deep.equal" assertions
  // https://glebbahmutov.com/cypress-examples/commands/assertions.html
  //
  cy.wait('@track')
    .its('request.body')
    .should('deep.equal', {
      eventName: 'load',
      args: {},
    })

  // Tip: you can define _another_ intercept for POST /track
  // right before clicking the plus button
  // and give it a different alias "lastTrack"
  // It is ok for a single request to match multiple intercepts
  // validate the "lastTrack" request and response data
  cy.get('#num1').type(20)
  cy.get('#num2').type(6)
  cy.intercept('POST', '/track').as('lastTrack')
  cy.get('#add').click()
  // wait for the "lastTrack" alias and confirm the request body
  // Note: the response will still be confirmed by the "track" intercept
  cy.wait('@lastTrack')
    .its('request.body')
    .should('deep.equal', {
      eventName: '+',
      args: {
        a: 20,
        b: 6,
      },
    })
})