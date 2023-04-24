/// <reference types="cypress" />

it('shows the loading element with Promise.delay', () => {
  cy.intercept('GET', '/fruit', (req) => {
    return Cypress.Promise.delay(2000)
  }).as('fruit');
  cy.visit('/');
  cy.contains('#fruit', 'loading...').should('be.visible');
  cy.wait('@fruit')
    .its('response.body.fruit')
    .then(cy.log)
    .then((fruit) => {
      cy.contains('#fruit', fruit).should('be.visible')
    });
});
