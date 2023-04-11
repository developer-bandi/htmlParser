const {
  DATA_STATE,
  TAG_OPEN_STATE,
  TAG_NAME_STATE,
  START_TOKEN,
  END_TOKEN,
  TEXT_TOKEN,
} = require("./constant");

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

module.exports = tokenizer;
