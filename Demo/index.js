import { default as $T, $} from "../tinyDOM.js";
demo();
createCodeDetails();

function demo() {
  // imported with
  // import { default as $T, $} from "../tinyDOM.js";
  // ------------------------------------------------
  const {H3, DIV, A, CODE, DETAILS, SUMMARY} = $T;
  const link2Repo = A({
    href: "https://github.com/victorqribeiro/TinyJS",
    target: "_blank",
    text: "The TinyJS repository"
  });
  const topLink = A({
    target: "_top",
    href: "https://github.com/KooiInc/tinyDOM",
    text: "Back to repository"
  });
  
  const detailsContent = DIV(
    DIV("This library offers an alternative for the ", link2Repo, " library."),
    DIV("Basically the same idea, but a bit more versatile. Address className as ",
      CODE("{class: ...}"), ", data-attributes as ",
      CODE("{data: {one: '...', ...} }"), " and innerHTML/textContent as",
      CODE("{text: ...}"), " or ", CODE("{html: ...}"), "."),
    DIV("Furthermore, the tags can be used <i>case insensitive</i> (e.g. ",
      CODE("const {h3, H3, DIV, p, P} = $T"),
      "), and some attributes/properties considered <i>evil</i> are prohibited. "),
    DIV("The library uses a ", CODE("Proxy"),
      ", so the elements are lazy loaded (on demand)."),
    DIV({text: "Enjoy!"})
  );
  
  $("body").append(
    topLink,
    DETAILS({open: true}, SUMMARY("<span>About</span>"), detailsContent),
    DIV({id: "NameDiv"}, H3({data: {name: "Mary POC Demo"}}), $T.p("How are <i><b>you</b></i> today?")),
  );
}

// code
function createCodeDetails() {
  const demoCode = demo.toString();
  document.body.append(
    $T.details(
      $T.summary(`<span>The code for the above</span>`),
      $T.pre({class: `language-javascript line-numbers`},
        $T.code({
          class: `language-javascript`,
          text: demoCode.slice(demoCode.indexOf(`\/\/`), -2).replace(/\n {2}/g, `\n`) } ) ) )
  );
  Prism.highlightAll();
}