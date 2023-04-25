/// <reference types="cypress" />

it('stubs the network call with the same object', () => {
  // mock the GET /fruit request and always return the same response
  // { fruit: 'crab apple' }
  cy.intercept('GET', '/fruit', {
    fruit: 'crab apple',
  }).as('fruit')
  // visit the home page using https://on.cypress.io/visit
  cy.visit('/')
  // wait for the fruit intercept to finish
  cy.wait('@fruit')
  // check if the expected mock response is shown
  // https://on.cypress.io/contains
  cy.contains('#fruit', 'crab apple')
  // every page reload will show the same fruit
  // https://on.cypress.io/reload
  cy.reload()
  cy.contains('#fruit', 'crab apple')
  // we could vary how many times the intercept is used
  // via the "times" option, but not much more
})

it('stubs the odd and even network calls differently', () => {
  // a local variable keeping the count of intercepted requests
  let count = 0
  // intercept the GET /fruit request
  // and return the {fruit: "kiwi"} for odd responses
  // and return the {fruit: "melon"} for even responses
  // you can implement the response logic in the route handler
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruit', (req) => {
    if (count % 2 === 0) {
      req.reply({
        fruit: 'kiwi',
      })
    } else {
      req.reply({
        fruit: 'melon',
      })
    }
    count += 1
  })
    // save the intercept under an alias "fruit"
    .as('fruit')
  // visit the home page using https://on.cypress.io/visit
  cy.visit('/')
  // the first request should return the "kiwi" response
  // https://on.cypress.io/contains
  cy.contains('#fruit', 'kiwi')
  // the second request should return the "melon" response
  // https://on.cypress.io/reload
  cy.reload()
  cy.contains('#fruit', 'melon')
  // third request sees the "kiwi" again
  cy.reload()
  cy.contains('#fruit', 'kiwi')
})

it('changes the real server response to upper case', () => {
  // this local variable will hold the intercepted response
  // set by the route handler callback code
  let fruitSent
  // intercept the GET /fruit request
  // let it go to the server using the req.continue() method
  // with a callback to get the server response
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruit', (req) => {
    req.continue((res) => {
      // note: the server response has a few properties
      // like the HTTP status code, plus the parsed "body" object
      // you can assert properties of the response
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.have.property('fruit')
      // and then modify the response body using any logic
      // in our case, let's modify the "fruit" value
      // inside the response body object
      // and save the result in the local variable "fruitSent"
      fruitSent = res.body.fruit =
        res.body.fruit.toUpperCase()
    })
  })
    // save the network intercept as an alias "fruit"
    .as('fruit')
  // visit the home page using https://on.cypress.io/visit
  cy.visit('/')
  // wait for the network intercept "fruit" to finish
  cy.wait('@fruit')
    // use the cy.then callback to verify the local variable "fruitSent"
    .then(() => {
      // once the server has sent the response,
      // the local variable "fruitSent" will have a value
      // which should be an uppercase string
      expect(fruitSent)
        .to.be.a('string', 'got a string value')
        .and.to.match(/^[A-Z]+$/, 'uppercase value')
      // confirm the sent uppercase fruit is displayed
      cy.contains('#fruit', fruitSent)
    })
})