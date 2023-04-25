/// <reference types="cypress" />

it('changes the loaded CSS resource', () => {
  // intercept the the "style.css" resource
  // using https://on.cypress.io/intercept
  // let the request continue to the server
  // and get the response back.
  //
  // Note: the CSS resources are cached by the browser
  // thus before the request is made, remove the
  // request headers "If-None-Match" and "If-Modified-Since"
  // Tip: you can dump the request headers to the console
  // to see them to make sure you are deleting the right ones
  //
  // Parse the response text using any method you like
  // and add to the "#fruit" CSS style a red border line.
  // Give the network intercept an alias.
  cy.intercept('GET', 'style.css', (req) => {
    delete req.headers['if-none-match']
    delete req.headers['if-modified-since']

    req.continue((res) => {
      res.body += '\n#fruit { border: 1px solid red; }'
    })
  }).as('style')
  //
  // visit the page
  cy.visit('/')
  // Confirm the intercept worked
  // and its response status code was 200
  // and not 304 (Not Modified)
  cy.wait('@style')
    .its('response.statusCode')
    .should('equal', 200)
  // Confirm the added CSS style was applied
  // to the page element
  cy.get('#fruit')
    // the element should have CSS border
    .should('have.css', 'border')
    // because the width might be a float
    // just confirm it is a solid red line
    .and('include', 'solid rgb(255, 0, 0')
})