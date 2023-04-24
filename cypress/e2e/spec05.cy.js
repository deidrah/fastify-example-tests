/// <reference types="cypress" />

it('shows a different fruit after reloading the page', () => {
  cy.visit('/');
  cy.get('#fruit').should('not.include.text', 'loading')
    .invoke('text')
    .then((fruit) => {
      cy.reload();
      cy.get('#fruit').should('not.include.text', 'loading')
        .and('not.have.text', fruit);
    });
})
