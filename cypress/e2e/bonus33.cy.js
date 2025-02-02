/// <reference types="cypress" />

it('adds a new item and then finds it (static wait)', function () {
  // wait for the item to be added to the database (one minute)
  // plus for the search service to scrape it (another minute)
  // https://on.cypress.io/wait
  cy.wait(120_000)

  // let's find the item using the search page "/find-item.html"
  // https://on.cypress.io/visit
  cy.visit('/find-item.html')
  // because we use the "function () { ... }" callback syntax
  // we can access the aliased value using "this.<alias>" syntax
  // Enter the item's name into the <input id="item-text">
  // input box and press Enter key
  cy.get('#item-text').type(this.name + '{enter}')
  // check if the item is found by looking at the "id=output" element
  // also confirm the displayed price is correct
  // https://on.cypress.io/contains
  cy.contains('#output', this.name)
    .contains('.price', this.price)
    .should('be.visible')
})

it('adds a new item and then finds it (retries the search)', function () {
  // Let's not wait longer than necessary.
  // The item might take UP to 1 minute to be added
  // and it might take UP to 1 minute to scrape it into the search index.
  // Or it might take 1 second to do everything.
  // Let's avoid the wait by entering the item into the search page
  // and seeing if the item is found. If not - we can enter it again
  // after a short delay.
  //
  // let's find the item using the search page "/find-item.html"
  // https://on.cypress.io/visit
  cy.visit('/find-item.html')
  // let's retry entering the item's name using the "recurse" function
  // https://github.com/bahmutov/cypress-recurse
  // - clear the "#item-text" input field and blur it
  // https://on.cypress.io/clear
  // https://on.cypress.io/blur
  // - type the item's name plus Enter key
  // - return a Cypress chain that checks the "#output" element
  // if it contains the item's name
  // https://on.cypress.io/contains
  // Tip: to avoid cy.contains failing, attach a no-op
  // ".should(callback)" function
  // See https://glebbahmutov.com/cypress-examples/recipes/conditional-testing.html
  // Stop iterating if the item is found
  // If the item is not found, wait 10 seconds and try again
  // Repeat UP to 120 seconds
  recurse(
    () => {
      cy.get('#item-text').clear().blur()
      cy.get('#item-text').type(this.name + '{enter}')
      return cy
        .contains('#output', this.name)
        .should(Cypress._.noop)
    },
    ($el) => $el.length,
    {
      log: 'found the item',
      delay: 10_000,
      timeout: 120_000,
    },
  )
  // check the item is found for sure
  // https://on.cypress.io/contains
  cy.contains('#output', this.name)
    .contains('.price', this.price)
    .should('be.visible')
})

it('adds a new item and then finds it (retries the API calls)', function () {
  // call API until the item is returned from our database
  cy.log('**call the API until the item is returned**')
  // use the "recurse" function from the "cypress-recurse" NPM package
  // to query the URL "/items/item name"
  // https://on.cypress.io/request
  // if the request is successful, stop
  // otherwise, wait 10 seconds and try again
  // Keep querying up to 1 minute
  recurse(
    () =>
      cy.request({
        url: '/items/' + encodeURIComponent(this.name),
        failOnStatusCode: false,
      }),
    (response) => response.isOkStatusCode,
    {
      log: '✅ item is in our database',
      delay: 10_000,
      timeout: 60_000,
    },
  )
  // call the search API until it finds the item
  cy.log('**call the search API**')
  // use the "recurse" function from the "cypress-recurse" NPM package
  // to query the URL "/find-item/item name"
  // https://on.cypress.io/request
  // if the request is successful, stop
  // otherwise, wait 10 seconds and try again
  // Keep querying up to 1 minute
  recurse(
    () =>
      cy.request({
        url: '/find-item/' + encodeURIComponent(this.name),
        failOnStatusCode: false,
      }),
    (response) => response.isOkStatusCode,
    {
      log: '✅ item has been scraped',
      delay: 10_000,
      timeout: 60_000,
    },
  )

  cy.log('**use the UI to find the scraped item**')
  // now visit the /find-item.html page
  cy.visit('/find-item.html')
  // enter the item's name and press Enter
  // https://on.cypress.io/get
  // https://on.cypress.io/type
  cy.get('#item-text').type(this.name + '{enter}')
  // the item _must_ be found now
  // check the item is found for sure
  // https://on.cypress.io/contains
  cy.contains('#output', this.name)
    .contains('.price', this.price)
    .should('be.visible')
})