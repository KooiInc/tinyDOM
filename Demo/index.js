import {default as CreateComponent, createOrRetrieveShadowRoot} from "./es-webcomponent-bundle.js";
import $T from "../tinyDOM.js";

addHandler();
demo();
createCodeDetails();
createCopyrightComponent();
$T.img({src: "https://sdn.nicon.nl/px0_git-tinyDOM-demo.png"});
window.$T = $T;
const [is, type] = [Symbol.for.is, Symbol.for.type];
window.is = is;

function demo() {
  // imported with
  // import $T from "../tinyDOM.js";
  // ------------------------------------------------
  // create custom error function for invalid tagNames
  $T.setError = key => $T.span(
    $T.b(
      {style: "color: red", id: "tagErrorMessage"},
      $T.code(key), " is ",
      $T.i("not"), " a valid HTML tag"
    )
  );
  
  // destructure some relevant tag functions
  const { H3, DIV, A, CODE, DETAILS, SUMMARY, P, p, I, B, NOTHING, } = $T;
  const revealCodeLink = text => I({data: {action: "revealCode"}, text});
  const printHTML = elem => $T.span({class: `htmlResult`}, elem.outerHTML.replace(/</g, "&lt;"));
  const jqlLink = A({
    target: "_blank",
    class: "linkJQL",
    href: "https://codeberg.org/KooiInc/JQx",
    text: "JQx",
  });
  const aboutContent =
    DIV(
      DIV("(", revealCodeLink("Click here"),
        " to reveal the code used to create the html in this demonstration page)"),
      DIV("This small <i>library</i> offers a way to dynamically create (nested) HTML elements\
         by converting tag names (<code>div</code> <code>table</code> etc.)\
         to element creation functions ('", I("tag functions"), "')."),
      DIV("Some examples (the default module export was imported as ", CODE("$T"), ")"),
      $T.UL(
        $T.li($T.code("$T.div('Hello world')"),
          " => ", printHTML($T.div("Hello world")) ),
        
        $T.li(
          $T.div({class: `noMargin`}, `Include <code>data-* attributes</code>`),
          $T.code("$T.p({class: 'hello, world', data: {world: ' World'}}, 'Hello')"),
          " =>", $T.br(),
          printHTML($T.p({class: 'hello, world', data: {world: ' World'}}, 'Hello')) ),
        
        $T.li(
          $T.div({class: `noMargin`}, "Include attributes that are not reflected " +
            "(can't be set using [element][attribute] = \"...\")"),
          $T.code(`$T.div({attributes: {is: "my-customized-ul"}}, "hello WRLD")`), ` =>`,
          $T.br(),
          printHTML($T.div({attributes: {is: "my-customized-ul"}}, "hello WRLD"))),
        
        $T.li($T.code("$T.span({text: 'Hello world'})"),
          " => ", printHTML($T.span({text: 'Hello world'})) ),
        
        $T.li("<code>$T.P('hello &lt;i>world&lt;/i>')</code>",
          " => ", printHTML($T.P("hello <i>world</i>")) ),
        
        $T.li($T.div({class: `noMargin`}, "Destructured:"),
          $T.CODE("const {p, P} = $T; p('hello world')"),
          " => ", printHTML(p("hello world")) ),
      ),
      DIV("A tag function is <i>case insensitive</i> (so ",
        CODE("$T.DIV"), " / ", CODE("$T.div"), " / ", CODE("$T.diV"), " are equal)."),
      DIV("Properties for a HTML element (e.g. ",
        CODE("class"), " or ", CODE("id"), ") can be passed in an object as the\
          first argument of the tag function. Everything from the next argument(s) is nested\
          within the created element. It may be strings, other HTML elements\
          created plainly or using tinyDOM tag functions.\
          Strings can be plain text or HTML."),
      DIV("Invalid tagnames will be converted to a function returning nothing (<code>undefined</code>) \
        by default, whilst reporting an error message in the console. \
        The 'error'-function may be re-assigned, e.g. to a function returning\
        an element containing an error message, or a function reporting an error\
        in the console. Use the setter ",
        DIV({class: `codeCenter`}, "<code>$T.setError = function([key]) {return ...})</code>"),
        "for that. See ", CODE("NOTHING()"), " in the ",
        revealCodeLink("example code")
      ),
      $T.div("Autonomous custom elements can also be used. The top bar of this demonstration " +
        "page is a small web component: <code>&lt;copyright-slotted&gt;</code>. " +
        "It is created using ",
        $T.code('$T["copyright-slotted"](...)'), ", which can also be ",
        $T.code('$T.copyrightSlotted(...)'), `.`),
      DIV("The library uses a ", CODE("Proxy"),
        ", so every tag function is <i>lazy loaded</i> (on demand)."),
      DIV("The library is included an used in ", jqlLink, $T.SPAN(` (a jQuery alike module).`) ),
      DIV("This document is completely created using the tinyDOM library (use CTRL+U to " +
        "see the HTML source of the original document).") ,
      DIV({text: "Enjoy!"})
    );
  
  // the elements until now only exist in memory
  // so, let's append them to the body of the DOM tree
  document.body.prepend(
    // a comment (see console/Elements)
    $T.comment(`hello, this is a comment`),
    DIV(
      {class: "container"},
      DIV( {class: "content"},
        DETAILS(
          {open: true}, SUMMARY("<span>About</span>"),
          aboutContent
        ),
        DIV(
          {id: "NameDiv"},
          H3({data: {name: "Mary POC Demo"}}),
          P("How are ", I(B("you")), " today?"),
          DIV("After rewriting the error function using <code>$T.setError</code>, ",
            $T.br(), "let's check this NOTHING tag function (", CODE("NOTHING()"),
            ", see ", revealCodeLink("Code"), ") => ",
            $T.div(NOTHING())
          )
        )
      )
    )
  );
}

function addHandler() {
  document.addEventListener("click", evt => {
    if (evt.target.dataset?.action === `revealCode`) {
      return document.querySelector(`#code`).open = true;
    }
  });
}

// code
function createCodeDetails() {
  const demoCode = demo.toString();
  document.querySelector(`.content`).append(
    $T.details({ id: "code" },
      $T.summary(`<span>The code for the above</span>`),
      $T.pre({class: `language-javascript line-numbers`},
        $T.code({
          class: "language-javascript",
          text: demoCode
                .slice(demoCode.indexOf("//"), -1)
                .replace(/\n {2}/g, `\n`).trim() } ) )
    )
  );
  Prism.highlightAll();
}

/* custom autonomous element (web component)
   see https://github.com/KooiInc/es-webcomponent-factory
   
   if you want to create a customized element (so: not autonomous)
   use
   
     CreateComponent( { componentName:string, onConnect:method, extends:string } );
   
   where extends reflects html tag string (e.g. DIV, p, ul)
   
   To render such an element, e.g. an extended 'div', create the element
   with tinyDOM, for example:
   
   const myElement = $T.div(
     {attributes: {is: "my-element"}}, // <= 'is' MUST be declared as attribute
     $T.span({slot: "mySlot"}, [slot content]),
   );
  
   // The element can not be appended directly (it will not trigger the onConnect method)
   // so use insertAdjacentHTML and the outerHTML of the created customized element
   document.body.insertAdjacentHTML(`afterbegin`, myElement.outerHTML);
 */
function createCopyrightComponent() {
  CreateComponent( { componentName: `copyright-slotted`, onConnect: copyrightComponentConnectHandler });
  renderCopyrightComponent();
}

function renderCopyrightComponent() {
  const ghLink = $T.a({
      slot: `link`,
      href: `//github.com/KooiInc/tinyDOM`,
      target: `_top`,
      text: ` Back to repository`});
  document.body.insertAdjacentElement(
    `beforeend`,
    $T.copyrightSlotted(
      $T.span({slot: `year`, text: String(new Date().getFullYear())}),
      ghLink,
    )
  );
}

function copyrightComponentConnectHandler(elem) {
  const shadow = createOrRetrieveShadowRoot(elem);
  const componentStyle = $T.style({textContent: `@import url(./cright.css)`});
  shadow.append(componentStyle,
    $T.div(
      $T.slot({name: "year"}),
      $T.slot({name: "link"})
    )
  );
}
