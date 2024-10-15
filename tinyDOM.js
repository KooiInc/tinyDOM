const [tags, $, $$] = [
  tagFactory(),
  selector => document.querySelector(selector),
  selector => [...document.querySelectorAll(selector)],
];

export { tags as default, $, $$ };

function tagFactory() {
  const tagStore = {};
  const tinyDOMProxyGetter = {
    get(obj, key) {
      const inStore = key.toLowerCase() in tagStore;
      const maybeElement =  inStore || 
        document.createElement(key?.toLowerCase()) instanceof HTMLElement;
      
      if (maybeElement) {
        if (!inStore) { tagStore[key.toLowerCase()] = tag2FN(key); }
        return tagStore[key.toLowerCase()];
      }

      return obj[key];
    }
  };

  return new Proxy(tagStore, tinyDOMProxyGetter);
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

function allowed(...values) {
  return values.filter(v =>
    v.toLowerCase().startsWith(`on`) ||
    /javascript.+:|javascript:|function|injected|noreferrer|alert|DataURL|eval/gi .test(v))
  .length < 1;
}