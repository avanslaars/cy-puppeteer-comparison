async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

describe('Footer', () => {
  it.skip('Finds a link by text', async () => {
    const page = await browser.newPage()
    // page.on('console', console.log)
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      // TODO: restructure this to handle these conditionals a nicer way
      if (url === 'http://localhost:3030/api/todos') {
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
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto('http://localhost:3030')

    const targetText = 'Completed'

    await page.$$eval(
      '.footer li > a',
      (links, targetText) => {
        const link = Array.from(links).find(a => a.textContent === targetText)
        link.click()
      },
      targetText
    )

    const els = await page.$$('.todo-list li')
    await expect(els.length).toBe(3)
  })

  it('Filters todos', async () => {
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
            { id: 2, name: 'Two', isComplete: true },
            { id: 3, name: 'Three', isComplete: true },
            { id: 4, name: 'Four', isComplete: false }
          ])
        })
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto('http://localhost:3030')

    const filters = [
      { linkText: 'Active', expectedLength: 2 },
      { linkText: 'Completed', expectedLength: 2 },
      { linkText: 'All', expectedLength: 4 }
    ]

    await asyncForEach(filters, async (filter, index) => {
      await page.$$eval(
        '.footer li > a',
        (links, targetText) => {
          const link = Array.from(links).find(a => a.textContent === targetText)
          link.click()
        },
        filter.linkText
      )
      const els = await page.$$('.todo-list li')
      await expect(els.length).toBe(filter.expectedLength)
    })
  })
})
