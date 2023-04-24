it('finds all fruits', () => {
  // visit the page
  cy.visit('/')
  const fruits = new Set()

  // keep getting the fruit from the page
  // and storing it in a Set object
  // and reloading the page
  // until we see the fruit we have already added
  function getFruit() {
    cy.get('#fruit')
      .should('not.have.text', 'loading...')
      .invoke('text')
      .then((fruit) => {
        cy.log(fruit)
        if (fruits.has(fruit)) {
          // we are done
          // print the collected list of fruits
          // check its length against the expected value
          const list = [...fruits].sort()
          cy.log(list.join(', '))
          expect(list).to.have.length(5)
        } else {
          fruits.add(fruit)
          cy.wait(500)
          cy.reload().then(getFruit)
        }
      })
  }
  getFruit()
})