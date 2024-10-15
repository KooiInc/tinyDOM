const [tags, $, $$] = [
  tagFactory(),
  selector => document.querySelector(selector),
  selector => [...document.querySelectorAll(selector)],
];

export { tags as default, $, $$ };

function tagFactory() {
  const tinyDOMProxyGetter = {
    get(obj, key) {
      const tag = key.toLowerCase();
      const inStore = tag in obj;
      const maybeElement =  inStore || 
        document.createElement(tag) instanceof HTMLElement;
      
      if (maybeElement) {
        if (!inStore) { obj[tag] = tag2FN(key); }
        return obj[tag];
      }

      return obj[key];
    }
  };

  return new Proxy({}, tinyDOMProxyGetter);
}

function tag2FN(tag) {
  return function(initial, ...args) {
    let elem;

    if (initial.constructor === String) {
      const maybeHtml = containsHTML(initial);
      elem = createElement(tag, maybeHtml ? {html: initial} : {text: initial});
    }

    if (initial instanceof HTMLElement) {
      elem = createElement(tag);
      elem.append(initial);
    }

    if (!elem) {
      elem = createElement(tag, initial);
    }

    if (args.length) {
      args.forEach(arg => {
        maybe({
          trial: _ => containsHTML(arg)
            ? elem.insertAdjacentHTML(`beforeend`, arg)
            : elem.append(arg),
          whenError: err => console.info(`${tag} not created\n`, err)})
        });
     }

     return elem;
  }
}

function createElement(name, props = {}) {
  const data = Object.entries(structuredClone(props?.data || {}));
  
  if (props?.data) {
     delete props.data;
  }

  if (props?.class) {
    props.className = props.class;
    delete props.class;
  }
  
  if (props?.html) {
    props.innerHTML = props.html;
    delete props.html;
  }
  
  if (props?.text) {
    props.textContent = props.text;
    delete props.text;
  }

  props = Object.fromEntries(
    Object.entries(props)
      .filter( ([key, value]) => 
        allowed(key.trim(), `${value}`.trim()) ) );

  const elem = Object.assign(document.createElement(name), props);
  
  if (data.length) {
    for (let [key, value] of data) {
      elem.dataset[key] = value;
    }
  }
  
  return elem;
}

function maybe({trial, whenError = err => console.log(err)} = {}) {
  try {
    if (trial?.constructor !== Function) {
      throw new TypeError(`maybe: trial parameter not a Function or Lambda`);
    }
    return trial();
  } catch (err) {
    return whenError?.constructor === Function ? whenError(err) : console.error(err);
  }
}

function containsHTML(str) {
  return str.constructor === String && /<.*>/.test(str);
}

// Poor man's client side cleanup.
// You should implement a server side sanitizer!
function allowed(...values) {
  return values.filter(v =>
    v.toLowerCase().startsWith(`on`) ||
    /javascript.+:|javascript:|function|injected|noreferrer|alert|DataURL|eval/gi .test(v))
  .length < 1;
}