/// <reference types="cypress" />

it('stubs all network API calls except allowed ones', () => {
  // intercept all network calls that request content application/json
  // Hint: use the header "content-type"
  // inspect the request object and allow the "POST /calculate"
  // calls to continue to the server. Give these requests alias "calculate".
  // Reject all other API calls by replying with the status code 500
  // Give rejected API calls alias "blocked"
  // https://on.cypress.io/intercept
  cy.intercept(
    {
      headers: {
        'content-type': 'application/json',
      },
    },
    (req) => {
      if (
        req.method === 'POST' &&
        req.url.endsWith('/calculate')
      ) {
        req.alias = 'calculate'
        return req.continue()
      } else {
        req.alias = 'blocked'
        return req.reply({
          statusCode: 500,
          body: {},
        })
      }
    },
  )

  // visit the /calculator.html page
  cy.visit('/calculator.html')
  // type 3 into the element with id "num1"
  cy.get('#num1').type('3')
  // type 6 into the element with id "num2"
  cy.get('#num2').type('6')
  // click the button with id "add"
  cy.get('button#add').click()
  // check that the answer 9 is shown
  cy.contains('#answer', '9')
  // there must be at least one blocked API call
  // confirm by waiting on the "@blocked" alias
  // https://on.cypress.io/wait
  cy.wait('@blocked')
  // and a single calculate API call
  // confirm by waiting on the "@calculate" alias
  cy.wait('@calculate')
})