/// <reference types="cypress" />

// to intercept the requests _before every_ test
// move this `beforeEach` into the support file
beforeEach(() => {
  // intercept all requests and let them continue
  // going to the server. When the server replies,
  // check the response status code. It should be below 400.
  // https://on.cypress.io/intercept
  cy.intercept('*', (req) => {
    req.continue((res) => {
      if (res.statusCode >= 400) {
        const msg = `${res.statusCode} ${req.url}`
        // tip: print the request and the response
        // to the DevTools console
        console.error({ req, res })
        throw new Error(msg)
      }
    })
  })
})

// enable the test to see it fail
it('successfully completes every network request', () => {
  // visit the page "/bundles.html" and see if the test fails
  // https://on.cypress.io/visit
  cy.visit('/bundles.html')
})

