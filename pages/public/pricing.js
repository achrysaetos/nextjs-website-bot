import initStripe from "stripe";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { CheckIcon } from '@heroicons/react/20/solid'
import { useUser } from "../../context/user";
import Footer from "../../components/footer";

const includedFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

export default function Pricing({ plans }) {
  const { user, login, isLoading } = useUser();

  // Use axios' fetch api to subscribe to a plan
  const processSubscription = (planId) => async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    await stripe.redirectToCheckout({ sessionId: data.id }); // redirect to Stripe checkout page
  };

  return (
    <>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas
              in. Explicabo id ut laborum.
            </p>
          </div>
          {plans.map((plan) => (
            <div key={plan.id}>
              <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">{plan.name}</h3>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis
                    repellendus etur quidem assumenda.
                  </p>
                  <div className="mt-10 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                  <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                    {includedFeatures.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">${plan.price / 100}</span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD / {plan.interval}</span>
                      </p>
                      {!!user && !user.is_subscribed && (
                        <button 
                          onClick={processSubscription(plan.id)}
                          className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Subscribe
                        </button>
                      )}
                      {!user && (
                        <button 
                          onClick={login} 
                          className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Create Account
                        </button>
                      )}
                      {!!user && user.is_subscribed && (
                        <Link href="/subscription">
                          <a className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Manage Subscription
                          </a>
                        </Link>
                      )}
                      <p className="mt-6 text-xs leading-5 text-gray-600">
                        Invoices and receipts available for easy company reimbursement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}

// Fetch product data at build time
export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  // Return the product data in workable format
  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};
