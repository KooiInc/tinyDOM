import $T from "../tinyDOM.js";
document.addEventListener("click", evt => {
  if (evt.target.dataset?.action === `revealCode`) {
    return document.querySelector(`#code`).open = true;
  }
});

demo();
createCodeDetails();

function demo() {
  // imported with
  // import $T from "../tinyDOM.js";
  // ------------------------------------------------
  const {H3, DIV, A, CODE, DETAILS, SUMMARY, P, p, I, B, NOTHING} = $T;
  const revealCodeLink = text => I({data: {action: "revealCode"}, text});
  const printHTML = elem => elem.outerHTML.replace(/</g, "&lt;");
  const back2RepoLink = A( {
    target: "_top",
    href: "https://github.com/KooiInc/tinyDOM",
    text: "Back to repository" } );
  const aboutContent =
    DIV(
      DIV("(", revealCodeLink("Click here"),
        " to reveal the code used to create the html in this demonstration page)"),
      DIV("This small <i>library</i> offers a way to dynamically create HTML elements\
         by converting tag names (<code>div</code> <code>table</code> etc.)\
         to element creation functions ('", I("tag functions"), "')."),
      DIV("Some examples (the default library export was imported as ", CODE("tags"), ")"),
      $T.UL(
        $T.li($T.code("tags.div('Hello world')"),
          " => ", printHTML($T.div("Hello world"))),
        $T.li($T.code("tags.p({class: 'helloworld', data: {world: ' World'}}, 'Hello')"),
          " =>", $T.br(),
          printHTML($T.p({class: 'helloworld', data: {world: ' World'}}, 'Hello'))),
        $T.li($T.code("tags.span({text: 'Hello world'}"),
          " => ", printHTML($T.span({text: 'Hello world'}))),
        $T.li("<code>tags.P('hello &lt;i>world&lt;/i>')</code>",
          " => ", printHTML($T.P("hello <i>world</i>"))),
        $T.li($T.CODE("const {p, P} = tags; p('hello world')"),
          " => ", printHTML(p("hello world"))),
      ),
      DIV("A tag function is <i>case insensitive</i> (so ",
        CODE("tags.DIV"), " / ", CODE("tags.div"), " / ", CODE("tags.dIV"), " are equal)."),
      DIV("The properties for a HTML element, e.g. ",
        CODE("class"), " or ", CODE("id"), " can be given as an object in the\
          first argument. Everything from the next argument(s) is nested\
          within the created element. It may be strings or other HTML elements.\
          Strings may contain html."),
      DIV("Invalid tagnames will be converted to a function returning a ",
        CODE("&lt;b style:'color:red'>"), " element containing an error message.\
        See ", CODE("NOTHING()"), " in the ",
        revealCodeLink("example code")
      ),
      DIV("The library uses a ", CODE("Proxy"),
        ", so the tag functions are <i>lazy loaded</i> (on demand)."),
      DIV({text: "Enjoy!"})
    );
  
  // the elements until now only exist in memory
  // so, let's append them to the body of the DOM tree
  document.body.append(
    DIV( {class: "container"},
      DIV( {class: "content"},
        back2RepoLink,
        DETAILS({open: true}, SUMMARY("<span>About</span>"), aboutContent),
        DIV({id: "NameDiv"},
          H3({data: {name: "Mary POC Demo"}}),
          P("How are ", I(B("you")), " today?"),
          DIV("Let's check this NOTHING tag function (",
            CODE("NOTHING()"),
            ", see ",
            revealCodeLink("Code"),
           ") => ",
            NOTHING()
          )
        )
      )
    )
  );
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