import { default as IS, maybe, } from "https://unpkg.com/typeofanything@latest/Dist/toa.min.js";
const converts = { html: `innerHTML`, text: `textContent`,  class: `className` };
let elementFunctionCollection = {};
let error = _ => null;

export default tinyDOM();

function tinyDOM() {
  return Object.freeze(new Proxy(elementFunctionCollection, getProxy()));
}

function getProxy() {
  return {
    get(tagFns, key) {
      const tagRaw = String(key);
      const isAutonomousCustom = tagRaw.includes(`-`) || /([a-z][A-Z])/.test(tagRaw);
      const tag = isAutonomousCustom ? toDashedNotation(tagRaw) : String(key)?.toLowerCase();
      
      switch(true) {
        case tag in tagFns: return tagFns[tag];
        case validateTag(tag): return createTagFunctionProperty({tag, tagRaw: isAutonomousCustom ? tagRaw : undefined, key});
        default: return createTagFunctionProperty({tag, key, isError: true});
      }
    },
    set(tagFns, key, value) {
      if (key === `setError` && typeof value === 'function') { error = value; }
      return true;
    },
    enumerable: false, configurable: false
  };
}

function createTagFunctionProperty({tag, key, tagRaw, isError = false} = {}) {
  let writableClone = cloneExact();
  
  if (tagRaw) {
    Object.defineProperty(writableClone, tagRaw, {
      get() { return isError ? _ => error(key) ?? `` : tag2FN(tag); }
    } );
  }
  
  Object.defineProperty(writableClone, tag, {
    get() { return isError ? _ => error(key) ?? `` : tag2FN(tag); }
  } );
  
  return reFreeze(writableClone, tagRaw ?? tag);
}

function reFreeze(writableClone, tag) {
  elementFunctionCollection = Object.freeze(new Proxy(writableClone, getProxy()));
  return elementFunctionCollection[tag];
}

function cloneExact() {
  return Object.fromEntries(
    Object.entries(Object.getOwnPropertyDescriptors(elementFunctionCollection))
  );
}

function processNext(root, next, tagName) {
  next = next?.isJQx && next.first() || next;
  return maybe({
    trial: _ => containsHTML(next) ? root.insertAdjacentHTML(`beforeend`, next) : root.append(next),
    whenError: err => console.info(`${tagName} not created, reason\n`, err)
  });
}

function tagFN(tagName, initial, ...nested) {
  const elem = retrieveElementFromInitial(initial, tagName);
  nested?.forEach(arg => processNext(elem, arg, tagName));
  return elem;
}

function retrieveElementFromInitial(initial, tag) {
  initial = isComment(tag) ? cleanupComment(initial) : initial;
  
  switch(true) {
    case IS(initial, String): return createElement(tag, containsHTML(initial, tag) ? {html: initial} : {text: initial});
    case IS(initial, Node): return createElementAndAppend(tag, initial);
    default: return createElement(tag, initial);
  }
}

function cleanupProps(props) {
  delete props.data;
  delete props.attributes;
  if ( Object.keys(props).length < 1 ) { return props; }
  
  Object.keys(props).forEach( key => {
    const keyCI = key.toLowerCase();
    keyCI in converts && (props[converts[keyCI]] = props[key]) && delete props[key]; } );
  return props;
}

function createElementAndAppend(tag, element2Append) {
  const elem = createElement(tag);
  elem.append(element2Append);
  return elem;
}

function createElement(tagName, props = {}) {
  props = isObjectCheck(props, {});
  const data = Object.entries(props.data ?? {});
  const attributes = Object.entries(props.attributes ?? {});
  const elem = Object.assign(
    isComment(tagName) ? new Comment() : document.createElement(tagName),
    cleanupProps( props ) );
  data.length && data.forEach(([key, value]) => elem.dataset[key] = value);
  attributes.length && attributes.forEach( ([key, value]) => elem.setAttribute(key, value) );
  return elem;
}

function isObjectCheck(someObject, defaultValue) {
  return defaultValue
    ? IS(someObject, {isTypes: Object, notTypes: [Array, null, NaN, Proxy], defaultValue})
    : IS(someObject, {isTypes: Object, notTypes: [Array, null, NaN, Proxy]});
}

function toDashedNotation(str2Convert) {
  return str2Convert.replace(/[A-Z]/g, a => `-${a.toLowerCase()}`).replace(/^-|-$/, ``);
}

function cleanupComment(initial) {
  return isObjectCheck(initial) ? initial?.text ?? initial?.textContent ?? `` : String(initial);
}

function containsHTML(str, tag) {
  return !isComment(tag) && IS(str, String) && /<.*>|&[#|0-9a-z]+[^;];/i.test(str);
}

function isComment(tag) { return /comment/i.test(tag); }

function validateTag(name) { return !IS(createElement(name), HTMLUnknownElement); }

function tag2FN(tagName) { return (initial, ...args) => tagFN(tagName, initial, ...args); }
