require("newrelic");
const express = require("express");
const cors = require("cors")();
const path = require("path");
const db = require("../database/database");

const json = express.json();
const server = express();
const DIST = path.join(__dirname, "..", "client", "dist");

server.use(cors);
server.use(json);

server.use("/", express.static(DIST));
server.use("/bundle", express.static(path.join(DIST, "bundle.js")));
server.use("/style", express.static(path.join(DIST, "style.css")));

// server.get("/products/:id", (req, res) => {
//   db.getProductById(req.params.id)
//     .then(product => {
//       res.status(200).send(product);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).end();
//     });
// });

// server.get("/products/:id/go", (req, res) => {
//   db.getCloseIds(req.params.id)
//     .then(product => {
//       res.status(200).send(product);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).end();
//     });
// });

server.get("/products", (req, res) => {
  let paramID = 303030;
  db.getRelatedProducts(paramID)
    .then(list => {
      res.send(list);
    })
    .catch(err => {
      console.log(err);
      res.end();
    });
});

server.patch("/reviews/update", (req, res) => {
  db.updateProductReviews(req.body)
    .then(results => {
      console.log(results);
      res.status(200).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

module.exports = server;
