## tinyDOM

**Create HTML elements using the element name as a function**

This library offers an alternative for the [The TinyJS repository](https://github.com/victorqribeiro/TinyJS) library. 
Like the original, it offers a way to create HTML elements, using the tag name as a function, e.g. `tags.div("Hello world")`
or `tags.P({class: "helloworld", data: {world: " World"}}, "Hello")`.

It use basically the same idea, but a bit more versatile.

- The library uses a `Proxy`, so the element functions are lazy loaded (on demand).
- address the `className` property as `{class: ...}`
- address `data-attributes` as `{data: {one: '...', ...}`
- address `innerHTML/textContent` as `{html: ...}` or `{text: ...}`.
- tag function names are *case insensitive* (e.g. `const {h3, H3, DIV, p, P} = tags`)
- attributes/properties considered *evil* are prohibited (but for production use this should be a server side check).

Check the [demonstration page](https://kooiinc.github.io/tinyDOM/Demo) of this project for examples.

Enjoy!
