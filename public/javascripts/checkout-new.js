var stripe = Stripe('pk_iA4yhIvVYDbQXSX3qNy4ioAL1HQIU');
var elements = stripe.elements();

var $form = $('#checkout-form');

$form.submit(function(event) {
  $form.find('button').prop('disabled', true);

  stripe.createToken('card_info', {
    cardNumber: $('#card-number').val(),
    cardCvc: $('#card-cvc').val(),
    cardExpiry: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    cardName: $('#card-name').val(),
  }).then(function(stripResponseHandler) {
    // handle result.error or result.token
    return false;
  });
});

function stripeResponseHandler(status, response) {
  if (response.error) {
    $('#charge-error').text(response.error.message);
    $('#charge-error').removeClass('hidden');
    $form.find('button').prop('disabled', false);
  } else { //Token was created!
    var token = response.id; //Get the token ID;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    $form.get(0).submit();
  }
}
