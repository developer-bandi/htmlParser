const DATA_STATE = "dataState";
const TAG_OPEN_STATE = "tagOpenState";
const TAG_NAME_STATE = "tagNameState";
const START_TOKEN = "startToken";
const END_TOKEN = "endToken";
const TEXT_TOKEN = "textToken";
const util = require("util");

const singleTag = ["br", "img", "hr"];

const html =
  '<html><head></head><body><div id="root" class="rootClass">hello</div></body></html>';

const tokenizer = (html) => {
  const tokens = [];
  let status = DATA_STATE;
  let curToken = {};
  let attribute = false;
  let attributeKey = "";
  for (let i = 0; i < html.length; i++) {
    if (status === TAG_OPEN_STATE) {
      if (html[i] === "/") {
        curToken.type = END_TOKEN;
        curToken.tagName = "";
      } else {
        curToken.type = START_TOKEN;
        curToken.tagName = "";
        curToken.tagName += html[i];
      }
      status = TAG_NAME_STATE;
    } else if (status === TAG_NAME_STATE) {
      if (html[i] === ">") {
        status = DATA_STATE;
        if (attribute && attributeKey !== "") {
          const [key, value] = attributeKey.split("=");
          curToken[key] = value;
          attribute = false;
          attributeKey = "";
        }
        tokens.push(curToken);
        curToken = {};
        continue;
      }
      if (html[i] === " ") {
        attribute = true;
        if (attributeKey !== "") {
          const [key, value] = attributeKey.split("=");
          curToken[key] = value;
          attributeKey = "";
        }
      }

      if (attribute) {
        if (html[i] === '"' || html[i] === " ") continue;
        attributeKey += html[i];
      } else {
        curToken.tagName += html[i];
      }
    } else {
      if (html[i] === "<") {
        if (curToken.type === TEXT_TOKEN) {
          curToken.content = curToken.tagName;
          delete curToken.tagName;
          tokens.push(curToken);
          curToken = {};
        }
        status = TAG_OPEN_STATE;
      } else {
        if (curToken.type !== TEXT_TOKEN) {
          curToken.type = TEXT_TOKEN;
          curToken.tagName = html[i];
        } else {
          curToken.tagName += html[i];
        }
      }
    }
  }
  return tokens;
};

const treeBuilder = (tokens) => {
  const stack = [];

  stack.push({
    type: "document",
    children: [],
  });

  for (let i = 0; i < tokens.length; i++) {
    const { type, tagName, content } = tokens[i];
    const attributes = Object.fromEntries(
      Object.entries(tokens[i]).filter(
        ([key]) => key !== "type" && key !== "tagName"
      )
    );
    if (type === START_TOKEN) {
      const node = {
        type: "element",
        tagName,
        attributes,
        children: [],
      };

      stack[stack.length - 1].children.push(node);

      if (!singleTag.includes(type)) {
        stack.push(node);
      }
    } else if (type === END_TOKEN) {
      while (stack[stack.length - 1].tagName !== tagName) {
        stack.pop();
      }
      stack.pop();
    } else {
      const node = {
        type: "text",
        content,
      };

      stack[stack.length - 1].children.push(node);
    }
  }

  while (stack.length > 1) {
    stack.pop();
  }
  return stack[0];
};

const result = treeBuilder(tokenizer(html));

console.log(util.inspect(result, false, null));
