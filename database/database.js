// const mongoose = require("mongoose");
// const products = require("./productModel");

// const DB_PATH = `mongodb://localhost:27017/Products`;

// mongoose.connect(
//   DB_PATH,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   console.log("jd is amazing")
// );

var mysql = require("mysql");
var mysqlConfig = require("./config.js");

var connection = mysql.createConnection(mysqlConfig);

connection.connect(err => {
  if (err) {
    throw err;
  } else {
    console.log("db is connected!");
  }
});

module.exports.getProductById = id =>
  new Promise((pass, fail) => {
    products.findOne({ id }, (err, doc) => {
      if (err) {
        fail(err);
      } else {
        pass(doc);
      }
    });
  });

// module.exports.getRelatedProducts = id =>
//   new Promise((pass, fail) => {
//     products
//       .find(
//         { $and: [{ id: { $gt: id } }, { id: { $lt: id + 13 } }] },
//         (err, docs) => {
//           if (err) {
//             fail(err);
//           } else {
//             pass(docs);
//           }
//         }
//       )
//       .limit(12);
//   });

module.exports.getRelatedProducts = theID =>
  new Promise((pass, fail) => {
    connection.query(
      `SELECT * FROM productsql WHERE (id > ${theID} limit 12`,
      (err, docs) => {
        if (err) {
          fail(err);
        } else {
          pass(docs);
        }
      }
    );
  });

module.exports.updateProductReviews = ({ id, rating }) =>
  new Promise((pass, fail) => {
    console.log("updating reviews");
    console.log(id, rating);
    products.find({ id }, (err, doc) => {
      if (err) {
        fail(err);
      } else {
        console.log(doc);
        const newTotal = doc[0].rating * doc[0].reviews + rating;
        const newCount = doc[0].reviews + 1;
        const newRating = newTotal / newCount;
        console.log(newTotal, newCount, newRating);
        products.updateOne(
          { id },
          { rating: newRating, reviews: newCount },
          (err2, result) => {
            if (err2) {
              fail(err2);
            } else {
              pass(result);
            }
          }
        );
      }
    });
  });
