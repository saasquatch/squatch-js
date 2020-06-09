const express = require("express");
const httpShutdown = require("http-shutdown");
const path = require("path");
const port = process.env.PORT || 5000;
const app = express();

// serve static assets normally
app.use(express.static(__dirname + "/dist"));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "index.html"));
});

const server = httpShutdown(
  app.listen(0, () => {
    console.log(`Web is listening on port ${server.address().port}`);
  })
);

server.host = `http://localhost:${server.address.port}`;
module.exports = server;
