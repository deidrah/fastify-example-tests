/// <reference types="Cypress" />

// import the cypress-map plugin commands
import 'cypress-map'

it('confirms the number of likes on each article', () => {
  // intercept the articles returned by the server
  cy.intercept({
    method: 'GET',
    hostname: 'api.realworld.io',
    pathname: '/api/articles',
  })
    // give the intercept an alias
    .as('articles')
  cy.visit('/')
  // wait for the articles to load
  // and get the list of articles from the server's response
  cy.wait('@articles')
    .its('response.body.articles')
    // print the first article using cy.print
    // https://github.com/bahmutov/cypress-map
    .print((list) => list[0])
    // map the list of articles into the list of favorites counts
    .map('favoritesCount')
    // and print it to the Command Log
    .should('be.an', 'array')
    .print()
    // confirm each count is between 1 and 1000
    .and((counts) => {
      counts.forEach((n) => expect(n).to.be.within(1, 1000))
    })
})