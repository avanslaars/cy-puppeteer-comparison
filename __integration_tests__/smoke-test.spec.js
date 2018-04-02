import axios from 'axios'

describe('Smoke Tests', () => {
  beforeEach(async () => {
    await axios.delete('http://localhost:3030/api/todos/all')
  })

  describe('No Todos', () => {
    it('Adds a new todo', async () => {
      const page = await browser.newPage()
      const newTodo = 'Buy Milk'
      await page.goto('http://localhost:3030')
      await page.type('.new-todo', newTodo, { delay: 100 })
      await page.keyboard.press('Enter')
      // Wait for function returns a promise that resolves when the fn evals to a truthy val
      // It polls. The default polling execs the fn constantly in requestAnimationFrame
      // Timeout defaults to 30 seconds... this is configurable
      // If fn doesn't eval to truthy by timeout, promise rejects & test fails
      const selector = '.todo-list li'
      await page.waitForFunction(
        sel => Array.from(document.querySelectorAll(sel)).length === 1,
        {},
        selector
      )
    })
  })

  describe('With todos', () => {
    beforeEach(async () => {
      const todos = require('./todos-fixture.json')
      await axios.post('http://localhost:3030/api/todos/bulkload', { todos })
    })

    it('Deletes todos', async () => {
      const listSelector = '.todo-list li'
      const checkListLength = (sel, expected) =>
        Array.from(document.querySelectorAll(sel)).length === expected
      const page = await browser.newPage()
      await page.goto('http://localhost:3030')
      await page.waitForFunction(checkListLength, {}, listSelector, 4)
      const liSelector = '.todo-list li:nth-child(1)'
      await page.hover(liSelector)
      const button = await page.$(`${liSelector} .destroy`)
      await button.click()
      await page.waitForFunction(checkListLength, {}, listSelector, 3)
    })

    it('Deletes todos with promise syntax', () => {
      const listSelector = '.todo-list li'
      const checkListLength = (sel, expected) =>
        Array.from(document.querySelectorAll(sel)).length === expected

      return browser.newPage().then(page => {
        return page.goto('http://localhost:3030').then(() => {
          const liSelector = '.todo-list li:nth-child(1)'
          return page
            .waitForFunction(checkListLength, {}, listSelector, 4)
            .then(() => {
              return page.hover(liSelector).then(() => {
                return page.$(`${liSelector} .destroy`).then(button => {
                  return button.click().then(() => {
                    return page.waitForFunction(
                      checkListLength,
                      {},
                      listSelector,
                      3
                    )
                  })
                })
              })
            })
        })
      })
    })

    it('Deletes todos with smarter promise syntax', () => {
      const liSelector = '.todo-list li:nth-child(1)'
      const listSelector = '.todo-list li'
      const checkListLength = (sel, expected) =>
        Array.from(document.querySelectorAll(sel)).length === expected

      return browser.newPage().then(page =>
        page.goto('http://localhost:3030').then(() => {
          page =>
            page
              .waitForFunction(checkListLength, {}, listSelector, 4)
              .then(() => page.hover(liSelector))
              .then(() => page.$(`${liSelector} .destroy`))
              .then(button => button.click())
              .then(() =>
                page.waitForFunction(checkListLength, {}, listSelector, 3)
              )
        })
      )
    })
  })
})
