import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import { updateUserApi } from '@/utils/supabase-client';
import { Box, Divider, AbsoluteCenter, Center } from '@chakra-ui/react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto mb-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-600">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-100 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();
  const [apikey, setApiKey] = useState<string>('');

  useEffect(() => {
    setApiKey(userDetails?.user_api || '');
  }, [userDetails]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      updateUserApi(user, apikey || '');
    } catch (error) {
      console.log('error', error);
    }
  }

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className="bg-white mb-8">
    <div className="mx-auto flex items-center justify-start flex-col space-y-4">
    <div className="container mx-auto w-3/4">
      <div className="flex items-center justify-between">
        <div className="tabs">
          <a className="tab tab-lifted tab-active font-semibold">
            Profile Info
          </a>
        </div>
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          Badge
        </span>
      </div>

      <Divider marginY='2' />

      <div className="flex flex-col sm:flex-row items-start justify-between">
        <ul className="mt-4 space-y-1 w-1/4">
          <li>
            <Link href="" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              Account
            </Link>
          </li>
          <li>
            <Link href="" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              Getting Started
            </Link>
          </li>
          <li>
            <Link href="" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              Tutorials
            </Link>
          </li>
          <li>
            <Link href="" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              Support
            </Link>
          </li>
          <li>
            <Link href="" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              Enterprise
            </Link>
          </li>
        </ul>

        <Center height={48} marginY={5}>
          <Divider orientation='vertical' />
        </Center>

        <div className="mt-4 w-3/4">
          <Card
            title="Your API Key"
            description="Enter your API key to unlock infinite messages!"
            footer={
              <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                <p className="pb-4 sm:pb-0">
                  Check your usage statistics on OpenAI.
                </p>
                <form action="https://platform.openai.com/account/usage" target="_blank" rel="noopener noreferrer">
                  <Button variant="slim" type="submit">
                    Open usage statistics
                  </Button>
                </form>
              </div>
            }
          >
            <form onSubmit={handleSubmit}>
              <div className="w-2/3">
                <input
                  className="mt-8 mb-4 w-3/4 bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  placeholder="Enter your API key"
                  value={apikey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  type="submit"
                  className="flex-none w-1/4 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </Card>
          
          <Card
            title="Your Plan"
            description={
              subscription
                ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                : ''
            }
            footer={
              <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                <p className="pb-4 sm:pb-0">
                  Manage your subscription on Stripe.
                </p>
                <Button
                  variant="slim"
                  loading={loading}
                  disabled={loading || !subscription}
                  onClick={redirectToCustomerPortal}
                >
                  Open customer portal
                </Button>
              </div>
            }
          >
            <div className="text-xl mt-8 mb-4 font-semibold">
              {isLoading ? (
                <div className="h-12 mb-6">
                  <LoadingDots />
                </div>
              ) : subscription ? (
                `${subscriptionPrice}/${subscription?.prices?.interval}`
              ) : (
                <Link href="/">Choose your plan</Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    
    <Box position='relative' marginTop='4'>
      <Divider />
      <AbsoluteCenter bg='white' px='4' fontSize='12' textColor='gray.200'>
        Powered by ChatGPT. Copyright © 2022 Chatterup.
      </AbsoluteCenter>
    </Box>
    </div>
    </div>
    </section>
  );
}
