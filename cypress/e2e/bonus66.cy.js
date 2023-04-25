/// <reference types="Cypress" />

// figure out how the tags get to the web application
// and confirm the Tags show every returned tag item
// (nothing is missing, and there are no extras)
it('shows the tags returned by the server', () => {
  // the application makes a call that gets redirected
  // so let's spy on the final network call
  cy.intercept({
    method: 'GET',
    hostname: 'api.realworld.io',
    pathname: '/api/tags',
  }).as('tags')
  cy.visit('/')
  // from the intercept, get the tags in the response body
  cy.wait('@tags')
    .its('response.body')
    .should('be.an', 'object')
    .and('have.property', 'tags')
    // yields the value of the property "tags"
    // from an object like {tags: [tag1, tag2, ...]}
    .should('be.an', 'array')
    // we don't control the number of tags, unfortunately
    .and('have.length.gte', 0)
    .then((tags) => {
      // confirm the right number of tags is shown
      cy.get('.sidebar .tag-list').within(() => {
        cy.get('.tag-pill').should('have.length', tags.length)
        // confirm every tag returned by the server is shown
        tags.forEach((tag) => {
          // we do not care for the order of tags,
          // just the text should be there
          cy.contains('.tag-pill', tag).should('be.visible')
        })
      })
    })
})

it('bonus: shows the tags returned by the stub', () => {
  // the application makes a call that gets redirected
  // so let's stub the final network call
  const tags = ['tag1', 'tag2', 'tag3']
  cy.intercept(
    {
      method: 'GET',
      hostname: 'api.realworld.io',
      pathname: '/api/tags',
    },
    { delay: 1000, body: { tags } },
  ).as('tags')
  cy.visit('/')
  // the application shows the loading tags text
  cy.get('.sidebar').within(() => {
    cy.contains('Loading tags').should('be.visible')
    // and then it hides
    cy.contains('Loading tags').should('not.be.visible')
  })
  // confirm our network stub was used
  cy.wait('@tags')
  // we know the tags already, let's confirm they are shown
  cy.get('.sidebar .tag-list').within(() => {
    cy.get('.tag-pill').should('have.length', tags.length)
    tags.forEach((tag) => {
      // we do not care for the order of tags,
      // just the text should be there
      cy.contains('.tag-pill', tag).should('be.visible')
    })
  })
})