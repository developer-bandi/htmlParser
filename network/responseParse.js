const responseParse = (response) => {
  const [header, body] = response.split("\r\n\r\n");

  return {
    header: headerParser(header),
    body: bodyParser(body),
  };
};

const headerParser = (header) => {
  const [info, ...headers] = header.split("\r\n");
  const [httpAndVersion, status] = info.split(" ");
  return {
    version: httpAndVersion.split("/")[1],
    status,
    header: Object.fromEntries(headers.map((header) => header.split(": "))),
  };
};

const bodyParser = (body) => {
  const rows = body.split("\n");
  rows.shift();
  rows.pop();
  rows.pop();
  return rows.join("\n");
};

module.exports = responseParse;
