describe('Form input', () => {
  it('Focuses the input on load', async () => {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      if (url === 'http://localhost:3030/api/todos') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        })
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto('http://localhost:3030')
    // get boolean to indicated active element is expected element
    const isExpected = await page.evaluate(() =>
      document.activeElement.classList.contains('new-todo')
    )
    await expect(isExpected).toBe(true)
  })

  it('Accepts input', async () => {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      if (url === 'http://localhost:3030/api/todos') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        })
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto('http://localhost:3030')
    const typedText = 'New todo'
    const selector = '.new-todo'
    await page.type(selector, typedText, { delay: 100 })
    // get input's value and make sure it is what was typed
    const val = await page.evaluate(
      sel => document.querySelector(sel).value,
      selector
    )
    await expect(val).toBe(typedText)
  })
})
