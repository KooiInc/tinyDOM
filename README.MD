[![](https://deno.bundlejs.com/?q=tinydom-es@latest&badge)](https://bundlejs.com/?q=tinydom-es)
[![](https://img.shields.io/npm/v/tinydom-es.svg?labelColor=cb3837&logo=npm&color=dcfdd9)](https://www.npmjs.com/package/tinydom-es)

## tinyDOM

### Create HTML elements using the element/tag name as a function

This small *library* offers a way to dynamically create HTML elements
using tag names as functions.

### Details

- The library uses a `Proxy`, so the element functions are *lazy loaded* (on demand).
- Tag function names are *case insensitive*  
  (e.g. `tags.DIV` or `tags.div`, `const {h3, H3, DIV, p, P} = tags`)

The first parameter of a tag function may be an Object literal,
containing textContent / innerHTML /   
[reflected element properties](https://javascript.plainenglish.io/html-properties-vs-attributes-7b3ab0db532b) / (data-)attributes.

- address the `className` property as `{class: 'class1 class2 ...'}`
- address `attributes` as `{attributes: {attr1: '...', ...}`
- address `data-attributes` as `{data: {one: '...', ...}}`
- address `innerHTML/textContent` as `{html: ...}` or `{text: ...}`

Check the [demonstration page](https://kooiinc.github.io/tinyDOM/Demo) to learn more.

Enjoy!

---
For a more comprehensive DOM helper, check my [JQuery alike](https://github.com/KooiInc/JQx) 
module (JQx).
