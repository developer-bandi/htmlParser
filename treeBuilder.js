const { START_TOKEN, END_TOKEN } = require("./constant");

const treeBuilder = (tokens) => {
  const stack = [];
  const singleTag = ["br", "img", "hr"];

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

module.exports = treeBuilder;
