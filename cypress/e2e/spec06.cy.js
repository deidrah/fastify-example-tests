/// <reference types="cypress" />

it('shows the loading element then fruit from a fixture', () => {
  cy.intercept('GET', '/fruit', { fixture: 'apple.json' });
  cy.visit('/');
  cy.contains('#fruit', 'loading...').should('be.visible');
  cy.contains('#fruit', 'apple').should('be.visible');
  cy.contains('#fruit', 'loading...').should('not.exist');
})
