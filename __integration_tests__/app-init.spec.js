// @ts-check

describe('TodoMVC', () => {
  it('should display "todos" text on page', async () => {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      // TODO: restructure this to handle these conditionals a nicer way
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

    expect(page).toMatch('todos')
  })

  it('should load initial todos', async () => {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      // TODO: restructure this to handle these conditionals a nicer way
      if (url === 'http://localhost:3030/api/todos') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'One', isComplete: false },
            { id: 2, name: 'Two', isComplete: false },
            { id: 3, name: 'Three', isComplete: false },
            { id: 4, name: 'Four', isComplete: false }
          ])
        })
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto('http://localhost:3030')
    const els = await page.$$('.todo-list li')
    await expect(els.length).toBe(4)
  })
})
