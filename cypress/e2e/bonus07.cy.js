/// <reference types="cypress" />

// The browser measures how fast each resource is loaded.
// You can get these measurements from the "window.performance" object.
it('checks the image load timing', () => {
  // visit the page "/tiger.html"
  cy.visit('/tiger.html')
  // there is a tiger image on the page
  // which you can check using the cy.get command
  cy.get('img[src="tiger.png"]')
  // first, get the origin of the page
  // using https://on.cypress.io/location "origin"
  //
  // then grab the application's window object
  // using https://on.cypress.io/window command
  // from the window object, get the "performance" object
  // https://on.cypress.io/its
  // and invoke its method "getEntriesByName"
  // https://on.cypress.io/invoke
  // with the argument origin + "/tiger.png"
  //
  // The performance.getEntriesByName method yields an array
  // with a single performance object
  // get that object and check its property "duration"
  // It should be faster than 30ms
  cy.location('origin').then((origin) => {
    cy.window()
      .its('performance')
      .invoke('getEntriesByName', origin + '/tiger.png')
      .should('have.length', 1)
      .its(0)
      .should('have.property', 'duration')
      .and('be.lessThan', 30) // ms
  })
})

it('slows down the image load', () => {
  // intercept the "GET /tiger.png" request 
  // and slow it down by 2 seconds
  // (see the spec10 lesson)
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/tiger.png', (req) => {
    return Cypress.Promise.delay(2000)
  })
  // visit the page "/tiger.html"
  // https://on.cypress.io/visit
  cy.visit('/tiger.html')
  // get the location and form the resource URL
  // origin + "/tiger.png" and get the performance measurement
  // Confirm the image is loaded after 2 seconds
  cy.location('origin').then((origin) => {
    // there is a tiger image on the page
    cy.get('img[src="tiger.png"]')
    cy.window()
      .its('performance')
      .invoke('getEntriesByName', origin + '/tiger.png')
      .should('have.length', 1)
      .its(0)
      .should('have.property', 'duration')
      .and('be.greaterThan', 2000) // ms
  })
})
