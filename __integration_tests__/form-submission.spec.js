import { route } from './helpers'
import { path } from 'ramda'

describe('Form submission', () => {
  it('Adds a new todo item', async () => {
    const page = await browser.newPage()
    const newTodo = 'Buy Milk'
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      const method = interceptedRequest.method()
      // TODO: restructure this to handle these conditionals a nicer way
      if (url === 'http://localhost:3030/api/todos' && method === 'GET') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 1, name: 'existing', isComplete: false }])
        })
      } else if (
        url === 'http://localhost:3030/api/todos' &&
        method === 'POST'
      ) {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 123, name: newTodo, isComplete: false })
        })
      } else {
        interceptedRequest.continue()
      }
    })

    await page.goto('http://localhost:3030')

    const typedText = 'New todo'
    await page.type('.new-todo', typedText, { delay: 100 })
    await page.keyboard.press('Enter')
    // wait for XHR? - verify this... works but doesn't seem to be required
    // page.waitForNavigation({ waitUntil: 'networkidle2' })
    const els = await page.$$('.todo-list li')
    expect(els.length).toBe(2)
  })

  it('Shows an error message for a failed form submission', async () => {
    const page = await browser.newPage()
    const newTodo = 'Test'
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      const url = interceptedRequest.url()
      const method = interceptedRequest.method()
      // TODO: restructure this to handle these conditionals a nicer way
      if (url === 'http://localhost:3030/api/todos' && method === 'GET') {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 1, name: 'existing', isComplete: false }])
        })
      } else if (
        url === 'http://localhost:3030/api/todos' &&
        method === 'POST'
      ) {
        interceptedRequest.respond({
          status: 500,
          contentType: 'application/json'
        })
      } else {
        interceptedRequest.continue()
      }
    })

    await page.goto('http://localhost:3030')

    const typedText = 'New todo'
    await page.type('.new-todo', typedText, { delay: 100 })
    await page.keyboard.press('Enter')

    const els = await page.$$('.todo-list li')
    expect(els.length).toBe(1) // original seed value, no new todo

    // times out and throws if element doesn't appear within default timeout (5s)
    await page.waitForSelector('.error', { visible: true })
  })
})
