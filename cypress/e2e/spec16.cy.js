/// <reference types="cypress" />

it('requests all fruits', () => {
  // request the fruit from the /fruit endpoint
  // using the https://on.cypress.io/request command
  const fruits = new Set()

  function getTheFruit() {
    cy.request('GET', '/fruit')
      // from the response get the body object, then the fruit
      // using the https://on.cypress.io/its command
      .its('body.fruit')
      .then(cy.log)
      .then((fruit) => {
        // and keep requesting until we see a fruit already in the set
        if (fruits.has(fruit)) {
          // print the collected list of fruits
          cy.log([...fruits].sort().join(', '))
        } else {
          // store each fruit in a Set object
          fruits.add(fruit)
          cy.wait(1000).then(getTheFruit)
        }
      })
  }
  getTheFruit()
})

What
