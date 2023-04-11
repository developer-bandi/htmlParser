const util = require("util");
const tokenizer = require("./tokenizer");
const treeBuilder = require("./treeBuilder");

const html =
  '<html><head></head><body><div id="root" class="rootClass">hello</div></body></html>';

const App = () => {
  const tokens = tokenizer(html);
  const domTree = treeBuilder(tokens);

  console.log(util.inspect(domTree, false, null));
};

App();
