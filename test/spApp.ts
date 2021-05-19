import express from "express";
import * as http from "http";

const app = express();

// serve static assets normally
app.use(express.static(__dirname + "/../dist"));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("/", function (req, res) {
  res.type("html");
  res.send(`
    <!doctype html>
    <html>
    <body>
    <script>
    !function(a,b){a("squatch","http://localhost:${getPort(
      server
    )}/squatch.min.js",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]={},c[a].ready=function(b){c["_" + a].ready =  c["_" + a].ready || [];c["_" + a].ready.push(b);},e=document.createElement("script"),e.async=1,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);
    </script>
    </body>
    </html>
  `);
});

let server: http.Server;

export default {
  async start() {
    return new Promise((resolve, reject) => {
      server = app.listen(0, (err: Error) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(`Web is listening on port ${getPort(server)}`);
        return resolve();
      });
      // server.host = `http://localhost:${server.address().port}`;
    });
  },
  async stop() {
    return new Promise((resolve, reject) => {
      server.close((err?: Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  },
  domain() {
    return "localhost:" + getPort(server);
  },
};

function getPort(server: http.Server) {
  const address = server.address();
  if (typeof address === "string") {
    throw new Error("Expected address info");
  }
  return address.port;
}
