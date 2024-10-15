import "./style.css";
import "./prism.css";
import "./prism.js";
import { default as $T, $} from "./tinyDOM.js";

const {H3, DIV, A, CODE, DETAILS, SUMMARY} = $T;
const link2Repo = A({
  href: "https://github.com/victorqribeiro/TinyJS", 
  target: "_blank", 
  text: "The TinyJS repository"});
const topLink = A({
  target: "_top", 
  href:"https://stackblitz.com/@KooiInc", 
  text: "All projects" } );

const detailsContent = DIV(
  DIV( "This library is an alternative for the ",  link2Repo,  "." ),
  DIV( "Check the code in this project for examples (",
    CODE({text: "index.js"}), " or click '<i>the code for the above</i>' below)."),
  DIV( "Basically the same idea, but a bit more versatile. Address className as ",
    CODE( "{class: ...}" ), ", data-attributes as ",
    CODE( "{data: {one: '...', ...} }" ), " and innerHTML/textContent as",
    CODE( "{text: ...}" ), " or ", CODE( "{html: ...}" ), "."),
    DIV( "Furthermore, the tags can be used <i>case insensitive</i> (e.g. ",
      CODE( "const {h3, H3, DIV, p, P} = $T"), 
        "), and some attributes/properties considered <i>evil</i> are prohibited. "),
    DIV( "The library uses a ", CODE("Proxy"), 
      ", so the elements are lazy loaded (on demand)."),
    DIV({ text: "Enjoy!" })
);

$("body").append(
  topLink,
  DETAILS( SUMMARY( { text: "About" } ), detailsContent ),
  DIV( { id: "NameDiv" },  H3({ data: { name: "Mary POC Demo"} }), $T.p( "How are <i><b>you</b></i> today?" ) ),
);

// code
document.body.append(
  DETAILS({open: true},
    SUMMARY(`The code for the above`),
    $T.pre({class: `language-javascript line-numbers`},
      CODE({class: `language-javascript`,
        text: `const {H3, DIV, A, CODE, DETAILS, SUMMARY} = $T;
const link2Repo = A({
  href: "https://github.com/victorqribeiro/TinyJS", 
  target: "_blank", 
  text: "The TinyJS repository"});
const topLink = A({
  target: "_top", 
  href:"https://stackblitz.com/@KooiInc", 
  text: "All projects" } );
const detailsContent = DIV(
  DIV( "This library is an alternative for the ",  link2Repo,  "." ),
  DIV( "Check the code in this project for examples (",
    CODE({text: "index.js"}), " or click '<i>the code for the above</i>' below)."),
  DIV( "Basically the same idea, but a bit more versatile. Address className as ",
    CODE( "{class: ...}" ), ", data-attributes as ",
    CODE( "{data: {one: '...', ...} }" ), " and innerHTML/textContent as",
    CODE( "{text: ...}" ), " or ", CODE( "{html: ...}" ), "."),
    DIV( "Furthermore, the tags can be used <i>case insensitive</i> (e.g. ",
      CODE( "const {h3, H3, DIV, p, P} = $T"), 
        "), and some attributes/properties considered <i>evil</i> are prohibited. "),
    DIV( "The library uses a ", CODE("Proxy"), 
      ", so the elements are lazy loaded (on demand)."),
    DIV({ text: "Enjoy!" })
);

$("body").append(
  topLink,
  DETAILS( SUMMARY( { text: "About" } ), detailsContent ),
  DIV( { id: "NameDiv" },
    H3({ data: { name: "Mary POC Demo" } }), 
    $T.p( "How are <i><b>you</b></i> today?" ) ),
);` } ) ) )
);

Prism.highlightAll();