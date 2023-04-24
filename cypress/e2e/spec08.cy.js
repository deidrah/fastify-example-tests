/// <reference types="cypress" />

import { fruit } from '../fixtures/apple.json';

it('imports the fixture from JSON file', () => {
  cy.log(`fruit: **${fruit}**`);
  cy.intercept('GET', '/fruit', { fixture: 'apple.json' });
  cy.visit('/');
  cy.contains('#fruit', fruit);
})
