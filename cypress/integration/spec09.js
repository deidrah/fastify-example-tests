/// <reference types="cypress" />

it('returns different fruits', () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/fruit',
      times: 1,
    },
    { fruit: 'grapes' },
  );
  cy.intercept(
    {
      method: 'GET',
      url: '/fruit',
      times: 1,
    },
    { fruit: 'apple' },
  );

  cy.visit('/');
  cy.contains('#fruit', 'apple').should('be.visible');
  cy.reload();
  cy.contains('#fruit', 'grapes').should('be.visible');
})
