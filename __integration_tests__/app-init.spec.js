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
})
