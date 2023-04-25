/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'

it('logs ping requests to the terminal', () => {
  // request the page "/unreliable" and allow it to fail
  // https://on.cypress.io/request
  // retry the call if is not ok using cypress-recurse
  // every second for up to 30 seconds
  recurse(
    () =>
      cy.request({
        url: '/unreliable',
        failOnStatusCode: false,
      }),
    (res) => res.isOkStatusCode,
    {
      timeout: 30_000,
      delay: 1000,
      log(res, data) {
        // log a message into the Command Log
        // flagging if the call was successful or not,
        // and the current attempt number
        const str = `${
          data.successful ? '✅' : '🚫'
        } attempt ${data.iteration} after ${
          data.elapsedDuration
        }`
        cy.log(str)
        // Bonus: print the same message to the terminal
        // using cy.task "print" defines in the plugins file
        // https://on.cypress.io/task
        cy.task('print', str)
      },
    },
  )
})