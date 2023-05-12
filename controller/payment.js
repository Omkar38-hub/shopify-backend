const stripe = require('stripe')(process.env.STRIPE_API_KEY)

const makPayment =  async (req, res) => {
    try{
        const {amount} = req.body;
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: 'Black T-shirt',
                },
                unit_amount: amount || 6,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: process.env.PAYMENT_SUCCESS_URL,
          cancel_url: process.env.PAYMENT_CANCEL_URL,
        });
      
        res.json(url, session.url);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
  }