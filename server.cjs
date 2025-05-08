const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const routes = require("./routes.json");

server.use(jsonServer.rewriter(routes));
server.use(middlewares);
server.use(router);

server.listen(5000, () => {
  console.log("JSON-Server listening on http://localhost:5000");
});
