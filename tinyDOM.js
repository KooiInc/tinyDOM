export default (function tagProxyFactory() {
  const tinyDOMProxyGetter = { get(obj, key) {
    const tag = String(key)?.toLowerCase();
    switch(true) {
      case tag in obj: return obj[tag];
      case validateTag(tag): return (obj[tag] = tag2FN(key)) && obj[tag];
      default: return obj[key];
    }
  } };
  return new Proxy({}, tinyDOMProxyGetter);
})();
const converts = {html: `innerHTML`, text: `textContent`,  class: `className`};

function validateTag(name) {
  return !/[^a-z0-9]|undefined|symbol|null/i.test(String(name)) && createElement(name) instanceof HTMLElement;
}

function processNext(root, argument, tagName) {
  return maybe({
    trial: _ => containsHTML(argument) ? root.insertAdjacentHTML(`beforeend`, argument) : root.append(argument),
    whenError: err => console.info(`${tagName} not created\n`, err)
  });
}

function tag2FN(tagName) {
  return (initial, ...args) => tagFN(tagName, initial, ...args);
}

function tagFN(tagName, initial, ...nested) {
  const elem = retrieveElementFromInitial(initial, tagName);
  nested?.forEach(arg => processNext(elem, arg, tagName));
  return elem;
}

function retrieveElementFromInitial(initial, tag) {
  switch(true) {
    case initial?.constructor === String:
      return createElement(tag, containsHTML(initial) ? {html: initial} : {text: initial});
    case initial instanceof HTMLElement: return createElementAndAppend(tag, initial);
    default: return createElement(tag, initial);
  }
}

function cleanupProps(props) {
  Object.keys(props).forEach( prop => {
    const propCI = prop.toLowerCase();
    propCI in converts && (props[converts[propCI]] = props[prop]) && delete props[prop]; } );
  delete props.data;
  return props;
}

function createElementAndAppend(tag, toAppend) {
  const elem = createElement(tag);
  elem.append(toAppend);
  return elem;
}

function createElement(tagName, props = {}) {
  const data = Object.entries(structuredClone(props?.data || {}));
  props = cleanupProps(props);
  const elem = Object.assign(document.createElement(tagName), props);
  data.length && data.forEach(([key, value]) => elem.dataset[key] = value);
  return elem;
}

function maybe({trial, whenError = err => console.log(err)} = {}) {
  try {
    if (trial?.constructor !== Function) {
      throw new TypeError(`tinyDOM:maybe: trial parameter not a Function`);
    }
    return trial();
  } catch (err) { return whenError(err); }
}

function containsHTML(str) {
  return str.constructor === String && /<.*>/.test(str);
}