/// <reference types="cypress" />

it('replaces the first item in the JSONP response', () => {
  // intercept the GET requests to "/api-jsonp" endpoint
  // that looks like /api-jsonp?callback=...
  // https://on.cypress.io/intercept
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api-jsonp',
    },
    (req) => {
      // let the request continue going to the server
      // and print the response body to show it is a string
      req.continue((res) => {
        // show the response from the server
        // which is something like "callbackName(list)"
        console.log(res.body)
        // remove the "callbackName(" + ")" from the response
        // to get just the stringified data sent by the server
        const from = res.body.indexOf('(')
        const to = res.body.indexOf(')', from)
        const text = res.body.substring(from + 1, to)
        // parse the response body to get the data JSON
        const data = JSON.parse(text)
        // confirm the server sent an array
        expect(data, 'server sends an array').to.be.an(
          'array',
        )
        // replace the first item in the list with "name: Cy" item
        data[0] = { name: 'Cy' }
        // construct the updated response and set "res.body"
        const callbackName = req.query.callback
        res.body =
          callbackName + '(' + JSON.stringify(data) + ')'
      })
    },
  )
    // give the call an alias "jsonp"
    .as('jsonp')
  // visit the "/jsonp.html" page
  // and confirm the call "jsonp" has happened
  cy.visit('/jsonp.html')
  cy.wait('@jsonp')
  // confirm there are two items shown in the list of names
  cy.get('#names li')
    .should('have.length', 2)
    // and the first item has the test name
    .first()
    .should('have.text', 'Cy')
})