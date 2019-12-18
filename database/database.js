const mongoose = require('mongoose');
const Product = require('./productModel');
const ENV = require('../config');

// const DB_PATH = `mongodb://${ENV.dbUser}:${ENV.dbPass}@${ENV.dbHost}:${ENV.dbPort}/${ENV.dbName}`;
const DB_PATH = ENV.dbLong;

mongoose.connect(DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports.getProductById = (id) => new Promise((pass, fail) => {
  Product.findOne({ id }, (err, doc) => {
    if (err) {
      fail(err);
    } else {
      pass(doc);
    }
  });
});

module.exports.getRelatedProducts = (idList) => new Promise((pass, fail) => {
  Product.find({ id: { $in: idList } }, (err, docs) => {
    if (err) {
      fail(err);
    } else {
      pass(docs);
    }
  });
});

module.exports.updateProductReviews = ({ id, rating }) => new Promise((pass, fail) => {
  console.log('updating reviews');
  console.log(id, rating);
  Product.find({ id }, (err, doc) => {
    if (err) {
      fail(err);
    } else {
      console.log(doc)
      const newTotal = (doc[0].rating * doc[0].reviews) + rating;
      const newCount = doc[0].reviews + 1;
      const newRating = newTotal / newCount;
      console.log(newTotal, newCount, newRating)
      Product.updateOne({ id }, { rating: newRating, reviews: newCount }, (err2, result) => {
        if (err2) {
          fail(err2);
        } else {
          pass(result);
        }
      });
    }
  });
});
