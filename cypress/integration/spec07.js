/// <reference types="cypress" />

it('uses the fixture to stub and check the page', () => {
  cy.fixture('apple.json').then(cy.log).then(data => {
    cy.intercept('GET', '/fruit', {fixture: 'apple.json'});
    cy.visit('/');
    cy.contains('#fruit', data.fruit).should('be.visible');
  })
})
