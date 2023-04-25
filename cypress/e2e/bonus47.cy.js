/// <reference types="cypress" />

it('shows the returned JSONP response', () => {
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
  cy.get('#names li').should('have.length', 2)
})

it('stubs a JSONP call', () => {
  const testData = [
    {
      name: 'Cy',
    },
  ]
  // intercept the ajax calls to the "/api-json" endpoint
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api-jsonp',
    },
    (req) => {
      // see the entire object of parameters
      // console.log(req.query)
      // look at the request object
      // grab the callback name from the request query object
      const callbackName = req.query.callback
      // if there is no callback name, throw an error
      if (!callbackName) {
        console.error(req.query)
        throw new Error('Missing the JSONP callback name')
      }
      // reply with a JavaScript snippet
      // that calls the function name set by the user
      // and includes the JSON object testData
      // Tip: make sure to set the appropriate "content-type" header
      req.reply({
        headers: {
          'content-type':
            'application/x-javascript; charset=utf-8',
        },
        body:
          callbackName +
          '(' +
          JSON.stringify(testData) +
          ')',
      })
    },
  )
    // give the call an alias "jsonp"
    .as('jsonp')
  cy.visit('/jsonp.html')
  // and confirm the call "jsonp" has happened
  cy.wait('@jsonp')
  // confirm the only item in the list has the text "Cy"
  cy.get('#names li')
    .should('have.length', 1)
    .first()
    .should('have.text', 'Cy')
})