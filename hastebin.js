const https = require("https");

module.exports = function(str) {
  return new Promise((resolve, reject) => {
    if(!str) return reject("str must be a string.");
    const req = https.request({
      host: "hastebin.com",
      path: "/documents",
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": Buffer.byteLength(str)
      }
    });
    req
      .once("response", (res) => {
        const body = [];
        res
          .on("data", (chunk) => body.push(chunk))
          .on("error", (err) => reject(err))
          .on("end", () => {
            const key = JSON.parse(Buffer.concat(body)).key;
            return resolve(`https://hastebin.com/${key}`);
          });
      })
      .once("error", (err) => reject(err));
    return req.end(str);
  });
}
