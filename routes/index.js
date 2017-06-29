var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');

// GET home page
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];

  Product.find(function(err, docs) {
    var productChunks = [];
    var chunkSize = 3;

    for (var i = 0; i < docs.length; i += chunkSize ){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', 
      products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart', function(req,res,next) {
  if(!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.get('/checkout', function(req,res,next) {

  if(!req.session.cart){
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  res.render('shop/checkout',{total: cart.totalPrice*100,
    errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res, next) {
  if(!req.session.cart) {
    return res.render('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  var stripe = require("stripe")("Bdjh057jOSfL4bfhe12zNqlaAKKQAYiC");

  // Copy from Stripe start
   var token = req.body.stripeToken; // Using Express

  // Charge the user's card:
  var charge = stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    description: "Example charge",
    source: token,
   }, function(err, charge) {
    // Display error and successful charges
    if (err) {
      req.flash('error',err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
    });

      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });

  // Copy from Stripe end
});

module.exports = router;
