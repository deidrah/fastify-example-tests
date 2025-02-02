/// <reference types="cypress" />

it('modifies the HTML responses', () => {
  // intercept the HTML document "/"
  // and change the response body by replacing a word
  // confirm the new word is shown on the page
  cy.intercept(
    {
      method: 'GET',
      url: '/',
    },
    (req) => {
      req.continue((res) => {
        res.body = res.body.replace('random', 'test')
      })
    },
  )
  cy.visit('/')
  cy.contains('Picked a test fruit')
})
