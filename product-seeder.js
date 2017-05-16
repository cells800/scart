var Product = require('./models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/5e/85/4b/5e854b571851592b15aa4eb923814784.jpg',
    title: 'Blue Owl',
    description: 'Beautiful & Rare',
    price: 20
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/70/e9/74/70e974f047bd0ee7aae124be0bc35d48.jpg',
    title: 'Red Owl',
    description: 'Coruja vermelha - Habita em Madagascar-Africa',
    price: 20
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/03/c9/99/03c9995da1e44f367c1625dae7cd24bd.jpg',
    title: 'Mystical',
    description: 'White,Beautiful & Rare',
    price: 20
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/0b/a9/52/0ba9529cce4ba90aff944692a96d040b.jpg',
    title: 'Oriental Bay-Owl',
    description: 'Amazing',
    price: 20
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/70/c7/9a/70c79ad608fd415b35dd08635a3b1438.jpg',
    title: 'Gray Owl',
    description: 'Time to bed',
    price: 22
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/e6/1a/21/e61a21f0c59b040bbed41f398b7238dc.jpg',
    title: 'Owl in the wood',
    description: 'Blend-in with the environment',
    price: 30
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/99/84/3f/99843f6762dee573482b5da67dec4b1e.jpg',
    title: 'Landing',
    description: 'Back from a hurt',
    price: 20
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/bc/cd/e3/bccde3ca7ebc9bab2cff6a4111bebaad.jpg',
    title: 'Striped Owl',
    description: 'An astronaut',
    price: 15
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/f1/12/4b/f1124b9f37d95ee09ad1840a3a503cae.jpg',
    title: 'Inverted Baby',
    description: 'White,Beautiful & Rare',
    price: 20
  })
];

var done = 0;
for (var i=0; i < products.length; i++) {
  products[i].save(function(err, result){
    done++;
    if (done === products.length){
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
