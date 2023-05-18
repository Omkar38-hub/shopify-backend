const {Router}  = require('express')
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
const router = Router()

router.post('/create-payment-intent', async (req, res) => {
    // const session = await stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'inr',
    //         product_data: {
    //           name: 'T-shirt',
    //         },
    //         unit_amount: 10,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: process.env.PAYMENT_SUCCESS_URL,
    //   cancel_url: process.env.PAYMENT_CANCEL_URL,
    // });

    try {
        const {amount} = req.body
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount || 2,
          currency: 'inr',
        });
    
        res.status(200).json(paymentIntent.client_secret);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
  
  });

module.exports = router