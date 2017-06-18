Stripe.setPublishableKey('pk_iA4yhIvVYDbQXSX3qNy4ioAL1HQIU');

var $form = $('#checkout-form');

$form.submit(function(event) {
  $form.find('button').prop('disabled', true);
  Stripe.card.createToken({
    number: $('#card-number').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val(),
  }, stripeResponseHandler);
  return false;
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
