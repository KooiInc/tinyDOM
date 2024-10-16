## tinyDOM

### Create HTML elements using the element name as a function

This small *library* offers a way to dynamically create HTML elements
using a tag name as Function.

Check the [demonstration page](https://kooiinc.github.io/tinyDOM/Demo) to learn how it works.

### Details
- The library uses a `Proxy`, so the element functions are lazy loaded (on demand).
- address the `className` property as `{class: ...}`
- address `data-attributes` as `{data: {one: '...', ...}`
- address `innerHTML/textContent` as `{html: ...}` or `{text: ...}`
- tag function names are *case insensitive*
  (e.g. `tags.DIV` or `tags.div`, `const {h3, H3, DIV, p, P} = tags`)

Enjoy!

---
For a more comprehensive DOM helper, check my [JQuery alike](https://github.com/KooiInc/JQL) 
module (JQL).
