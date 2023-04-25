/// <reference types="Cypress" />

it(
  'loads',
  { viewportWidth: 800, viewportHeight: 1000 },
  () => {
    // intercept the "GET /css-import/app.css" requests
    // and slow them down by 1 seconds
    // https://on.cypress.io/intercept
    cy.intercept('GET', '/css-import/app.css', () =>
      Cypress.Promise.delay(1000),
    )
    // visit the page "css-import"
    // https://on.cypress.io/visit
    cy.visit('/css-import')
      // observe how long the page takes to load until
      // the imported styles are applied
      // get the window object
      // using cy.window or the yielded window
      // from the cy.visit command
      // it should have an object "performance"
      // with object "timing" inside
      // https://on.cypress.io/its
      .its('performance.timing')
      // log the timing object to the DevTools console
      .then(console.log)
      // and compute the difference between
      // the "DOM content loaded end" and "Navigation start"
      // properties. It should be between 1 and 1.1 seconds
      .then(
        (t) =>
          t.domContentLoadedEventEnd - t.navigationStart,
      )
      .should('be.within', 1000, 1100)
  },
)