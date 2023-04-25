/// <reference types="Cypress" />

it(
  'uploads JSON fixtures and checks the response page',
  { viewportHeight: 600, viewportWidth: 1000 },
  () => {
    cy.visit('/drag-and-drop')
    // find the element with id "fileselect"
    // and select two JSON fixture files using "cy.selectFile"
    // "apple.json" and "sale.json"
    // https://on.cypress.io/selectfile
    cy.get('#fileselect').selectFile([
      'cypress/fixtures/apple.json',
      'cypress/fixtures/sale.json',
    ])
    // confirm there are two file info records
    cy.get('[data-cy=file-info]').should('have.length', 2)
    // submit the upload form
    // https://on.cypress.io/submit
    cy.get('form#upload').submit()
    // confirm the uploaded files page URL
    // https://on.cypress.io/location
    cy.location('pathname').should('equal', '/upload-files')
    // validate the displayed page
    // - the heading
    // - two JSON files
    cy.contains('h2', 'Uploaded 2 JSON files')
    cy.get('[data-cy="file"]')
      .should('have.length', 2)
      .first()
      .contains('[data-cy=filename]', 'apple.json')
    cy.get('[data-cy="file"]')
      .eq(1)
      .contains('[data-cy=filename]', 'sale.json')
  },
)