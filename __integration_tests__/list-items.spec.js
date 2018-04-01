describe('List Item Behavior', () => {
  it('Deletes an item', async () => {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      const method = interceptedRequest.method()
      // TODO: restructure this to handle these conditionals a nicer way
      if (url === 'http://localhost:3030/api/todos' && method === 'GET') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'One', isComplete: true },
            { id: 2, name: 'Two', isComplete: true },
            { id: 3, name: 'Three', isComplete: true },
            { id: 4, name: 'Four', isComplete: false }
          ])
        })
      } else if (method === 'DELETE') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({})
        })
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto('http://localhost:3030')

    const liSelector = '.todo-list li:nth-child(1)'
    await page.hover(liSelector)
    const button = await page.$(`${liSelector} .destroy`)
    await button.click()
    const els = await page.$$('.todo-list li')
    await expect(els.length).toBe(3)
  })

  it('Marks an item complete', async () => {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      const method = interceptedRequest.method()
      // TODO: restructure this to handle these conditionals a nicer way
      if (url === 'http://localhost:3030/api/todos' && method === 'GET') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'One', isComplete: false },
            { id: 2, name: 'Two', isComplete: true },
            { id: 3, name: 'Three', isComplete: true },
            { id: 4, name: 'Four', isComplete: false }
          ])
        })
      } else if (method === 'PUT') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, name: 'One', isComplete: true })
        })
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto('http://localhost:3030')

    const liSelector = '.todo-list li:nth-child(1)'
    const item = await page.$(liSelector)
    const checkbox = await item.$('.toggle')
    await checkbox.click()

    const hasClass = await page.evaluate(
      sel => document.querySelector(sel).classList.contains('completed'),
      liSelector
    )
    await expect(hasClass).toBe(true)
  })
})
