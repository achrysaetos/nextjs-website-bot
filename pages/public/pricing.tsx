import { useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { GetStaticPropsResult } from 'next';

import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import Button from '@/components/ui/Button';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';

import { Price, ProductWithPrice } from 'types';
import { CheckIcon } from '@heroicons/react/20/solid';
import Footer from '@/components/ui/Footer/Footer';
import Link from 'next/link';

interface Props {
  products: ProductWithPrice[];
}

type BillingInterval = 'year' | 'month';

const includedFeatures = [
  'Unlimited messages',
  'Unlimited chatbots',
  'Train on pdfs, urls, or text',
  'Customize the behavior of each bot',
];

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

  return {
    props: {
      products
    },
    revalidate: 60
  };
}

export default function Pricing({ products }: Props) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading, subscription } = useUser();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/signin');
    }
    if (subscription) {
      return router.push('/account');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!products.length)
    return (
      <section className="bg-white">
        <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-6xl font-extrabold text-black sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );

  return (
    <>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center sm:flex sm:flex-col sm:align-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Be Free</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              No subscriptions. Just messages.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Say goodbye to monthly subscription fees. Only pay for the messages you send through OpenAI's
              <span>
                <Link href="https://openai.com/pricing" className='text-indigo-600' target="_blank" rel="noopener noreferrer">
                  {' '} usage rates: {' '}
                </Link>
              </span>
              hundreds of messages for just a dollar.
            </p>
            {/* <div className="relative self-center mt-6 bg-zinc-100 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-100">
              <button
                onClick={() => setBillingInterval('month')}
                type="button"
                className={`${
                  billingInterval === 'month'
                    ? 'relative w-1/2 bg-zinc-600 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingInterval('year')}
                type="button"
                className={`${
                  billingInterval === 'year'
                    ? 'relative w-1/2 bg-zinc-600 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Yearly billing
              </button>
            </div> */}
          </div>

          {/* {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div key={product.id}> */}
                <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                  <div className="p-8 sm:p-10 lg:flex-auto">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                      UNLIMITED Pro
                    </h3>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                      No monthly subscription fee. Unlock unlimited messages with OpenAI's official ChatGPT key: $0.0015 (gpt-3.5-turbo) or $0.020 (text-davinci-003) per 750 words!
                    </p>
                    <div className="mt-10 flex items-center gap-x-4">
                      <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                        What's included
                      </h4>
                      <div className="h-px flex-auto bg-gray-100" />
                    </div>
                    <ul
                      role="list"
                      className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                    >
                      {includedFeatures.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                    <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                      <div className="mx-auto max-w-xs px-8">
                        <p className="text-base font-semibold text-gray-600">
                          No subscription required.
                        </p>
                        <p className="mt-6 flex items-baseline justify-center gap-x-2">
                          <span className="text-5xl font-bold tracking-tight text-gray-900">
                            FREE
                          </span>
                          {/* <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                            USD / {billingInterval}
                          </span> */}
                        </p>

                        <Link href="/signin" className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                          Get Started
                        </Link>

                        {/* <Button
                          variant="slim"
                          type="button"
                          disabled={isLoading}
                          loading={priceIdLoading === price.id}
                          onClick={() => handleCheckout(price)}
                          className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          {product.name === subscription?.prices?.products?.name
                            ? 'Manage'
                            : 'Subscribe'}
                        </Button> */}
                        <p className="mt-6 text-xs leading-5 text-gray-600">
                          OpenAI's usage rates will still apply.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              {/* </div>
            );
          })} */}
        </div>
      </div>

      <Footer />
    </>
  );
}
