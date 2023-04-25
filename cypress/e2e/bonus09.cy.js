/// <reference types="cypress" />

it('requests an image and gets its dimensions', () => {
  // request the image ourselves using cy.request command
  // with the "encoding: base64" option
  cy.request({
    url: '/tiger.png',
    encoding: 'base64',
  })
    // from the response get the body and the headers fields
    .then(({ body, headers }) => {
      // from the headers object, grab the "content-type" header
      // which gives us the correct mime type, like "image/png"
      const mime = headers['content-type']
      cy.log('mime', mime)
      // form the image data URL with the mime type and the base64 encoded image
      // following the template `data:${mime};base64,${body}`
      const imageDataUrl = `data:${mime};base64,${body}`
      // to parse the data URL and have an image element
      // use document.createElement and set the "src" attribute
      const image = document.createElement('img')
      image.src = imageDataUrl
      // let the browser decode the image by sleeping 100ms
      // https://on.cypress.io/wait
      // and using .then callback with the assertion
      cy.wait(100).then(() => {
        // from the image element, get the naturalHeight property
        // and confirm its value is 914 pixels
        expect(image).to.have.property(
          'naturalHeight',
          914,
          'image height',
        )
      })
    })
})
