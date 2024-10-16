const [tags, converts] = [
  tagFactory(),
  {html: `innerHTML`, text: `textContent`,  class: `className`},
];

export default tags;

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

function processNext(root, argument, tagName) {
  return maybe({
    trial: _ => containsHTML(argument)
      ? root.insertAdjacentHTML(`beforeend`, argument)
      : root.append(argument),
    whenError: err => console.info(`${tagName} not created\n`, err)
  });
}

function tagFN(tagName, initial, ...nested) {
  const elem = retrieveElementFromInitial(initial, tagName);
  nested?.forEach(arg => processNext(elem, arg, tagName));
  
  return elem;
}

function tag2FN(tagName) {
  return (initial, ...args) => tagFN(tagName, initial, ...args);
}

function retrieveElementFromInitial(initial, tag) {
  switch(true) {
    case initial.constructor === String:
      return createElement(tag, containsHTML(initial)
        ? {html: initial} : {text: initial});
    case initial instanceof HTMLElement:
      const elem = createElement(tag);
      elem.append(initial);
      return elem;
    default:
      return createElement(tag, initial);
  }
}

function cleanupProps(props) {
  delete props.data;
  Object.keys(props)
   .forEach( key => {
     const lcKey = key.toLowerCase();
     if (lcKey in converts) {
       props[converts[lcKey]] = props[key];
       delete props[key];
     }
   });
  
  return props;
}

function createElement(name, props = {}) {
  const data = Object.entries(structuredClone(props?.data || {}));
  props = cleanupProps(props);
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