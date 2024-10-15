## tinyDOM

**Create HTML elements using the element name as a function**

This library offers an alternative for the [The TinyJS repository](https://github.com/victorqribeiro/TinyJS) library. 
Like the original, it offers a way to create HTML elements, using the tag name as a function, e.g. `tags.div("Hello world")`
or `tags.P({class: "helloworld", data: {world: " World"}}, "Hello")`.

It use basically the same idea, but a bit more versatile. For example:

- address className as `{class: ...}`
- address data-attributes as `{data: {one: '...', ...}`
- address innerHTML/textContent  as `{html: ...}` or `{text: ...}`.

Furthermore, the tags can be used *case insensitive* (e.g. `const {h3, H3, DIV, p, P} = tags`), and some 
attributes/properties considered *evil* are prohibited.

The library uses a `Proxy`, so the elements are lazy loaded (on demand).

Check the [demonstration page](https://kooiinc.github.io/tinyDOM/Demo) of this project for examples.

Enjoy!
