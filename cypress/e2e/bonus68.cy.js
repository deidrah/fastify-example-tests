/// <reference types="cypress" />

it('visits the /register page', () => {
  // we will need the HTML of the index page beforehand
  cy.request('/')
    .its('body')
    .then((html) => {
      // intercept the "GET /register" call and return the HTML
      // of the index page. The client-side routing will load
      // and work based on the browser url "/register"
      cy.intercept('GET', '/register', (req) => {
        req.reply(html)
      })
    })
  // visit the /register page
  cy.visit('/register')
})