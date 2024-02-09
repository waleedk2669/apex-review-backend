require("dotenv").config({ path: `./.env` });

const stripe = require("stripe")(
  "sk_test_51OHVuDErhU2BBi1rAjtH4VomzozGPusHCQX5UVCaKKOGYpvn072F1E5jtjZmbFUthVBQZ1wXzKmB4ovZfvS1Do0U00D9BjO0Wi"
);
console.log(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
