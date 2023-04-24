import { recurse } from 'cypress-recurse'

// let's use the "recurse" function to reload the page
// until we see a repeated fruit. Then we can stop
// since we have seen all the fruits.
it('finds all the fruit using cypress-recurse and its built-in accumulator', () => {
  // First, visit the page
  // https://on.cypress.io/visit
  cy.visit('/')
  // try writing the "recurse()"
  // that adds each new fruit to a Set object
  // reducing the fruits into the set
  // use the "reduceFrom", "reduce", and "yield"
  // options to update the Set with each fruit
  // and yield the fruit to the next command
  recurse(
    () => {
      return cy
        .get('#fruit')
        .should('not.have.text', 'loading...')
        .invoke('text')
    },
    (fruit, fruits) => fruits.has(fruit),
    {
      log: false,
      timeout: 1000000,
      reduceFrom: new Set(),
      reduce(fruits, fruit) {
        fruits.add(fruit)
      },
      yield: 'reduced',
      post({ value }) {
        cy.log(value)
        cy.reload()
      },
    },
  )
    // we have specified "yield: reduced" in the above options
    // thus we get the Set object with fruits
    .then((fruits) => {
      cy.log('Found all fruits')
      // we are done
      // print the collected list of fruits
      // check its length against the expected value
      const list = [...fruits].sort()
      cy.log(list.join(', '))
      expect(list).to.have.length(5)
    })
})