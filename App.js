const Request = require("./network/request");
const responseParse = require("./network/responseParse");

const App = async () => {
  const url = "https://127.0.0.1:8080";
  const request = new Request(url);
  const response = await request.send();
  const { header, body } = responseParse(response);

  console.log(header, body);
};

App();
