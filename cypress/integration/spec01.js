/// <reference types="Cypress" />

it('shows some fruit', () => {
  cy.visit('/');
  cy.get('#fruit').should('not.have.text', 'loading')
    .invoke('text').should('match', /^[A-Z][a-z]+$/);
  //or
  cy.contains('#fruit', /^[A-Z][a-z]+$/);
})
