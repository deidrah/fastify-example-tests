/// <reference types="cypress" />

it('makes GET /fruit requests every minute', () => {
  cy.intercept('GET', '/fruit').as('getFruit');
  cy.clock(); //freezes time, intervals etc
  cy.visit('/');
  cy.wait('@getFruit').its('response.body.fruit')
    .then((fruit) => {
      cy.contains('#fruit', fruit).should('be.visible');
  });
  cy.tick(60_000); //advance the time
  
  cy.wait('@getFruit').its('response.body.fruit')
    .then((fruit) => {
      cy.contains('#fruit', fruit).should('be.visible');
  });

  cy.tick(60_000); //advance the time

  cy.wait('@getFruit').its('response.body.fruit')
    .then((fruit) => {
      cy.contains('#fruit', fruit).should('be.visible');
  });
})
