/// reference types="cypress" />

// https://github.com/bahmutov/cypress-recurse
import { recurse } from 'cypress-recurse'

// uses the recurse utility to check if the
// give URL is up and running
function ping(url, n = 5) {
  // call the "recurse" function with 3 arguments
  // 1: function with Cypress command chain
  // to fetch the URL using cy.window + invoke "fetch"
  // 2: the predicate function that returns true if the
  // first command yielded ok status code
  // 3: the options object with the number of attempts
  // and the delay between attempts
  //
  // Tip: remember you cannot simply use the cy.request
  // command since it is "invisible" to the cy.intercept
  recurse(
    () => cy.window().invoke('fetch', url).its('ok'),
    // the predicate function takes the yielded "ok" value
    // and returns it since we want to stop the recursion
    // when the fetch resolves with "ok: true"
    Cypress._.identity,
    // options object with the number of attempts, the delay
    // and the Command Log message at the end
    {
      delay: 500,
      log: `${url} is up`,
      limit: n,
    },
  )
}

it('retries pinging the server using cypress-recurse', () => {
  // stub the GET / endpoint to return an error 3 times
  // https://on.cypress.io/intercept
  cy.intercept(
    {
      method: 'GET',
      url: '/',
      times: 3,
    },
    {
      statusCode: 500,
    },
  )
  // ping the / endpoint 5 times or until it responds
  // by calling the ping function
  ping('/', 5)
  // now that the server responds, visit the "/"
  // https://on.cypress.io/visit
  cy.visit('/')
  // confirm the page loads by checking H1 text
  // https://on.cypress.io/contains
  cy.contains('h1', 'Fastify Example')
})