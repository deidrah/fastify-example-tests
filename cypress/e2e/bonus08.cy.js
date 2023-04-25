/// <reference types="cypress" />

it('redirects the image to another image URL', () => {
  // intercept the GET request to "/tiger.png" image
  // and return an object with the status code 302 (moved temporarily)
  // and the headers object with location "/bunny.png"
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/tiger.png', {
    statusCode: 302,
    headers: {
      location: '/bunny.png',
    },
  })
  // visit the page "/tiger.html"
  cy.visit('/tiger.html')
  // there is a "tiger" image on the page
  // which you can check using the cy.get command
  cy.get('img[src="tiger.png"]')
    // but the tiger image is really the bunny image
    // which we can check by using its natural height
    // by getting the DOM element and its "naturalHeight" property
    // https://on.cypress.io/its
    .its('0.naturalHeight')
    // the bunny.png the height is 937 pixels
    .should('equal', 937)
})

it('returns a fixture image', () => {
  // intercept the GET request to "/tiger.png" image
  // and return a fixture image "bunny.png"
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/tiger.png', {
    fixture: 'bunny.png',
  })
  // visit the page "/tiger.html"
  cy.visit('/tiger.html')
  // there is a "tiger" image on the page
  // which you can check using the cy.get command
  cy.get('img[src="tiger.png"]')
    // but the tiger image is really the bunny image
    // which we can check by using its natural height
    // by getting the DOM element and its "naturalHeight" property
    // https://on.cypress.io/its
    .its('0.naturalHeight')
    // the bunny.png the height is 937 pixels
    .should('equal', 937)
})
