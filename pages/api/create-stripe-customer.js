import initStripe from "stripe";
import { getServiceSupabase } from "../../utils/supabase";

const handler = async (req, res) => {
  // Prevent unauthorized person from calling this API (use big random string)
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send("You are not authorized to call this API");
  }
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  // Add a customer to Stripe records
  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  const supabase = getServiceSupabase(); // bypass RLS (server side)

  // Add stripe customer id to supabase profile table
  await supabase
    .from("profile")
    .update({
      stripe_customer: customer.id,
    })
    .eq("id", req.body.record.id);

  res.send({ message: `stripe customer created: ${customer.id}` });
};

export default handler;
