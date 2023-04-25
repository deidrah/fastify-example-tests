/// <reference types="cypress" />

it('fetches all fruits using cy.request and checks the first one', () => {
  // use https://on.cypress.io/request to get /all-fruits
  cy.request('/all-fruits')
    // from the response get the "body" property
    // using https://on.cypress.io/its command
    .its('body')
    // check if the yielded object is an array
    // https://on.cypress.io/should
    // https://glebbahmutov.com/cypress-examples/commands/assertions.html
    // and it should not be empty
    .should('be.an', 'array')
    .and('not.be.empty')
    // get the first element's "fruit" property
    // using https://on.cypress.io/its command
    // tip: you can use deep path to get to the property
    .its('0.fruit')
    // the first fruit is always "Apples"
    .should('equal', 'Apples')
})

it('checks that each fruit follows the schema', () => {
  // use https://on.cypress.io/request to get /all-fruits
  cy.request('/all-fruits')
    // grab the "body" property using https://on.cypress.io/its command
    .its('body')
    // iterate over each item in the yielded array
    // to check if it follows the schema:
    // 1. the item should have keys "k" and "fruit" only
    // 2. the "k" value should be a number
    // 3. the "fruit" value should be a string
    // tip: https://on.cypress.io/each
    .each((item) => {
      expect(item).to.have.keys('k', 'fruit')
      expect(item)
        .to.have.property('fruit')
        .and.be.a('string')
      expect(item).to.have.property('k').and.be.a('number')
    })
})

it('saves the response under an alias', () => {
  // use https://on.cypress.io/request to get /all-fruits
  cy.request('/all-fruits')
    // confirm the yielded response is an object
    // with at least the following keys
    // "status", "body", "duration", and "headers"
    // https://glebbahmutov.com/cypress-examples/commands/assertions.html
    .should(
      'include.keys',
      'status',
      'body',
      'duration',
      'headers',
    )
    // from the response object get the "body" property
    // https://on.cypress.io/its
    .its('body')
    // as the yielded value under an alias "fruits"
    // https://on.cypress.io/as
    .as('fruits')
  // because the cy.request command has already finished
  // we DO NOT need to wait for it. Instead we
  // simply use cy.get('@fruits') to get the aliased value
  // get the aliased value "@fruits" and confirm it is an array
  cy.get('@fruits').should('be.an', 'array')
  // get the aliased value "@fruits" and confirm it has more than 3 items
  cy.get('@fruits').should('have.length.greaterThan', 3)
})