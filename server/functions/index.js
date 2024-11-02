const functions = require("firebase-functions");

exports.newPayment = functions.https.onCall(async(data, context) => {
    try{
        const stripe = require('stripe')(functions.config().stripe.secret_key);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount,
            currency: data.curr,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    }catch{
        return null;
    }
});

exports.stripeWebHook = functions.https.onCall((data, context) => {
    const stripe = require('stripe')(functions.config().stripe.secret_key);
    const endpointSecret = functions.config().stripe.endpointsecret;
    const sig = context.rawRequest.headers['stripe-signature'];
    let event;
    try{
        event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
    }catch(e){
        return e;
    }
    switch(event.type){
        case 'payment_intent.payment_failed':
            const paymentIntentPaymentFailed = event.data.object;
            break;
        case 'payment_intent.processing':
            const paymentIntentProcessing = event.data.object;
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    return true;
});