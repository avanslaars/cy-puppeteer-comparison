// @ts-check
import { route } from './helpers'


describe('TodoMVC', () => {
  // TODO: Work out how to reset to allow for beforeEach instead of beforeAll
  beforeAll(async () => {
    await route('http://localhost:3030/api/todos',
      [
        { id: 1, name: 'One', isComplete: true },
        { id: 2, name: 'Two', isComplete: false },
        { id: 3, name: 'Three', isComplete: false },
        { id: 4, name: 'Four', isComplete: true }
      ]
    )

    await page.goto('http://localhost:3030')
  })

  // Seems like skipping async here is fine, maybe just do it for consistenct and to avoid accidentally missing it in other tests
  it('should display "todos" text on page', () => {
    expect(page).toMatch('todos')
  })

  it('should load initial todos', async () => {
    const els = await page.$$('.todo-list li')
    expect(els.length).toBe(4)
  })

  // it('should stub the API and load todos - version 2', async () => {
  //   // TODO: Figure out if we should wait for selector before using page.$$() on it

  // This version works, but doesn't allow returning the node list to get access
  // const listLen = await page.evaluate(selector => {
  //   const listItems = document.querySelectorAll(selector)
  //   return listItems.length
  // }, '.todo-list li.completed')
  // expect(listLen).toBe(2)

  //   // Maybe this can be converted to a dot-chained API like the Cypress API
  //   // What would that look like?

  //   // Here's one way I could work this into the allowed code - this is super specific
  //   // assertElementsPropToBe('.todo-list li.completed', 'length', 2)

  //   // const listLen = await page.$$eval('.todo-list li.completed', el => el.length)
  //   // await expect(listLen).toBe(2)
  //   // page.exposeFunction('expect', expect)

  //   // We can return an array based on the nodes, but cannot get nodes... guessing the reference can't be passed out of page context
  //   // const list = await page.$$eval('.todo-list li.completed', els => Array.from(els).map(el => el.textContent))
  //   // expect(list.length).toBe(2)
  //   // page.exposeFunction(clone)

  //   // Add ramda to the page!! - doesn't solve my desire to clone, but fucking cool!
  //   // await page.addScriptTag({ url: 'https://unpkg.com/ramda@0.25.0/dist/ramda.min.js' })

  //   // Using Ramda on the page... I intended to use this to clone and return DOM nodes, but that was a no-go
  //   // This usage is pointless, but demonstrates that scripts can be injected into the page and used in page.$eval/page.$$eval
  //   // const list = await page.$$eval('.todo-list li.completed', els => Array.from(els).map(el => R.toUpper(el.textContent)))
  //   // expect(list.length).toBe(2)

  //   const els = await page.$$('.todo-list li.completed')
  //   expect(els.length).toBe(2)
  // })
})
