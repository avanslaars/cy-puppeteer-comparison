# Puppeteer Notes

## Loading a script into the page

```js
// Using Ramda on the page... I intended to use this to clone and return DOM nodes, but that was a no-go
// This usage is pointless, but demonstrates that scripts can be injected into the page and used in page.$eval/page.$$eval
await page.addScriptTag({ url: 'https://unpkg.com/ramda@0.25.0/dist/ramda.min.js' })
const list = await page.$$eval('.todo-list li.completed', els => Array.from(els).map(el => R.toUpper(el.textContent)))
expect(list.length).toBe(2)
```