# Next.js, Supabase, and Stripe

A lightweight, production-ready template for building SaaS apps. 

Note: you will need to set up and configure your own Supabase and Stripe accounts.


## Steps to set up for production

1. In order to "activate" our Stripe account, we need to fill out some details about our business.
2. Update everywhere [http://localhost:3000](http://localhost:3000) is referenced in our application to use the CLIENT_URL environment variable, which can be set to localhost in .env.local.
3. Create a GitHub repo, and commit and push all of our changes.
4. Create a Vercel account, import project from GitHub, configure all environment variables and deploy!
5. Use our Vercel domain to configure our Customer Portal and Webhooks in Stripe.
6. Update STRIPE_SIGNING_SECRET environment variable in Vercel and manually redeploy.
7. Update our Site URL in Supabase and remove our test user and profile records.
8. Create a function hook in Supabase to use our Vercel domain


*Video tutorial [here](https://egghead.io/lessons/supabase-configure-stripe-for-production-and-deploy-next-js-application-with-vercel)*