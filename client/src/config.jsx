import T from 'prop-types';

const ENV = {
  serverPort: '3015',
  serverURL: 'localhost',
  serverHosted: 'ikeaprojectcarouselsservice-env.8fbp5upagt.us-west-2.elasticbeanstalk.com',
  imageURL: 'https://team-meatballs-ikea-carousel-images.s3.us-east-2.amazonaws.com/',
  productSchema: {
    id: T.number,
    name: T.string,
    price: T.number,
    rating: T.number,
    reviews: T.number,
    image: T.string,
    hasOptions: T.bool,
    isNewItem: T.bool,
    isFamilyPriced: T.bool,
    isOnSale: T.bool,
    loose: T.arrayOf(T.number),
    close: T.arrayOf(T.number),
  },
};

export default ENV;
