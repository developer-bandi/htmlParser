const net = require("net");

class Request {
  header = {};

  constructor(url) {
    const { host, port, path } = this.parseUrl(url);
    this.host = host;
    this.port = port || 80;
    this.path = path;
    this.header["Host"] = host;
    this.header["User-Agent"] = "miniBrowser/1.0";
    this.header["Accept-Language"] = "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7";
  }

  parseUrl(url) {
    try {
      const [hostAndPort, ...paths] = url.split("://")[1].split("/");
      const [host, port] = hostAndPort.split(":");
      const path = `/${paths.join("/")}`;

      return {
        host,
        port,
        path,
      };
    } catch {
      throw Error("url을 정확하게 입력하여주세요");
    }
  }

  toString() {
    return `GET ${this.path} HTTP/1.1\r\n${Object.keys(this.header)
      .map((key) => `${key}: ${this.header[key]}`)
      .join("\r\n")}\r\n\r\n`;
  }

  send() {
    return new Promise((resolve, reject) => {
      const connection = net.createConnection(
        {
          host: this.host,
          port: this.port,
        },
        () => {
          connection.write(this.toString());
        }
      );

      connection.on("data", (data) => {
        resolve(data.toString());
        connection.end();
      });
      connection.on("error", (error) => {
        console.log(error), reject(error);
        connection.end();
      });
    });
  }
}

module.exports = Request;
