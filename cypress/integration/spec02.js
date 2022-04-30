/// <reference types="cypress" />

it('shows the fruit returned by the server', () => {
  cy.intercept('GET', '/fruit').as('fruit');
  cy.visit('/');
  cy.wait('@fruit').its('response.body.fruit').then(cy.log)
    .then(fruit => {
      cy.contains('#fruit', fruit);
    });
  // spy on the network call the application makes
  // tip: use https://on.cypress.io/intercept
  //
  // visit the page
  // https://on.cypress.io/visit
  //
  // wait for the app to make the network call
  // (there might be a delay)
  // https://on.cypress.io/wait
  //
  // from the network call, get the response body
  // and the name of the fruit and confirm
  // the fruit is shown on the page
  // https://on.cypress.io/its
  // https://on.cypress.io/then
  // https://on.cypress.io/contains
})
