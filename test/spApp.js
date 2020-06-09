const express = require("express");
const httpShutdown = require("http-shutdown");
const path = require("path");
const app = express();

// serve static assets normally
app.use(express.static("../dist"));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("/", function (req, res) {
  res.type("html");
  res.send(`
    <!doctype html>
    <html>
    <body>
    <script>
    !function(a,b){a("squatch","http://localhost:${
      server.address().port
    }/squatch.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]={},c[a].ready=function(b){c["_" + a].ready =  c["_" + a].ready || [];c["_" + a].ready.push(b);},e=document.createElement("script"),e.async=1,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);
    </script>
    </body>
    </html>
  `);
});

const server = httpShutdown(
  app.listen(0, () => {
    console.log(`Web is listening on port ${server.address().port}`);
  })
);

server.host = `http://localhost:${server.address().port}`;
module.exports = server;
