/// <reference types="cypress" />

it('shows the fruit returned from the test', () => {
  cy.intercept('GET', '/fruit', { fruit: 'Kiwi'}).as('fruit');
  cy.visit('/');
  cy.wait('@fruit');
  cy.contains('#fruit', "Kiwi");
})
