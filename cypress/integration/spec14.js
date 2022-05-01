it('reloads the page until it shows Bananas', () => {
  // visit the page
  cy.visit('/')
  // if it shows the fruit "Bananas", stop
  // else
  //   wait for 1 second for clarity
  //   reload the page
  //   check again
  function checkFruit() {
    cy.get('#fruit')
      .should('not.have.text', 'loading...')
      .invoke('text')
      .then((fruit) => {
        if (fruit === 'Bananas') {
          cy.log('Bananas!')
        } else {
          cy.wait(1000)
          cy.reload().then(checkFruit)
        }
      })
  }
  checkFruit()
})