import IS from "https://cdn.jsdelivr.net/gh/KooiInc/typeofAnything/typeofany.module.min.js";
export default ( function tagProxyFactory() {
  const tinyDOMProxyGetter = { get(obj, key) {
    const tag = String(key)?.toLowerCase();
    switch(true) {
      case tag in obj: return obj[tag];
      case validateTag(tag): return (obj[tag] = tag2FN(key)) && obj[tag];
      default: return createErrorElementFN(obj, tag, key);
    }
  } };
  return new Proxy({}, tinyDOMProxyGetter); } )();

const converts = {html: `innerHTML`, text: `textContent`,  class: `className`};

function createErrorElementFN(obj, tag, key) {
  obj[tag] = () => createElement(`b`, {style:`color:red`,text:`Can not create '${key}'`});
  return obj[tag];
}

function validateTag(name) {
  return !/[^a-z0-9]|undefined|symbol|null/i.test(String(name)) && !IS(createElement(name), HTMLUnknownElement);
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
    case IS(initial, String):
      return createElement(tag, containsHTML(initial) ? {html: initial} : {text: initial});
    case IS(initial, HTMLElement): return createElementAndAppend(tag, initial);
    default: return createElement(tag, initial);
  }
}

function cleanupProps(props) {
  delete props.data;
  const propsClone = structuredClone(props);
  Object.keys(propsClone).forEach( key => {
    const keyCI = key.toLowerCase();
    keyCI in converts && (propsClone[converts[keyCI]] = propsClone[key]) && delete propsClone[key]; } );
  return propsClone;
}

function createElementAndAppend(tag, element2Append) {
  const elem = createElement(tag);
  elem.append(element2Append);
  return elem;
}

function createElement(tagName, props = {}) {
  const data = Object.entries(structuredClone(props?.data || {}));
  const elem = Object.assign(document.createElement(tagName), cleanupProps(ISOr(props, {}, Object)));
  data.length && data.forEach(([key, value]) => elem.dataset[key] = value);
  return elem;
}

function maybe({trial, whenError = err => console.log(err)} = {}) {
  try {
    if (!IS(trial, Function)) {
      throw new TypeError(`tinyDOM:maybe: trial parameter not a Function`);
    }
    return trial();
  } catch (err) { return IS(whenError, Function) ? whenError(err) : console.error(err); }
}

function ISOr(input, orValue, ...types) {
  return IS(input, ...types) ? input : orValue;
}

function containsHTML(str) {
  return str.constructor === String && /<.*>/.test(str);
}