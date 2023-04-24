/// <reference types="cypress" />

it('shows the fruit returned by the server', () => {
  cy.intercept('GET', '/fruit').as('fruit');
  cy.visit('/');
  cy.wait('@fruit').its('response.body.fruit').then(cy.log)
    .then(fruit => {
      cy.contains('#fruit', fruit);
    });
})
