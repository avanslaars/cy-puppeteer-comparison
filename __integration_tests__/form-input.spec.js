import { route } from './helpers'

describe('Form input', () => {
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

  it('Focuses the input on load', async () => {
    // cy.focused().should('have.class', 'new-todo')
    const isExpected = await page.evaluate(() => document.activeElement.classList.contains('new-todo'))
    expect(isExpected).toBe(true)
  })

  it('Accepts input', async () => {
    const typedText = 'New todo'
    const selector = '.new-todo'
    await page.type(selector, typedText, { delay: 100 })
    const val = await page.evaluate(() => document.querySelector(selector).value)
    expect(val).toBe(typedText)
  })
})
