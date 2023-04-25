/// <reference types="cypress" />

// this is another solution the problem shown in Lesson spec09
it('returns different fruits revisited', () => {
  // write the route handler function with custom logic
  // that returns the fruit "apple" on the first call
  // and the fruit "grapes" after that
  // https://on.cypress.io/intercept
  // cy.intercept(routeMatcher, routeHandler)
  let count = 0
  cy.intercept(
    {
      method: 'GET',
      url: '/fruit',
    },
    (req) => {
      count += 1
      if (count === 1) {
        req.reply({ fruit: 'apple' })
      } else {
        req.reply({ fruit: 'grapes' })
      }
    },
  )
  // visit the site
  cy.visit('/')
  // confirm it shows "apple"
  cy.contains('#fruit', 'apple').should('be.visible')
  // reload the site several times to check if it always
  // shows the same fruit "grapes"
  cy.reload()
  cy.contains('#fruit', 'grapes').should('be.visible')
  cy.reload()
  cy.contains('#fruit', 'grapes').should('be.visible')
  cy.reload()
  cy.contains('#fruit', 'grapes').should('be.visible')
})