/// <reference types="cypress" />

it('clearly shows the loading element', () => {
  cy.intercept('GET', '/fruit', {
    body: {fruit: 'Kiwi'},
    delay: 2000,
  });
  cy.visit('/');
  cy.get('#fruit').should('be.visible').and('have.text', 'loading...');
  cy.get('#fruit').should('not.contain', 'loading');
})
