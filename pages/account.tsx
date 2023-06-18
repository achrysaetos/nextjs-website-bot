import { useState, ReactNode, useEffect, useContext } from 'react';
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
import { Box, Divider, AbsoluteCenter, Center, useToast } from '@chakra-ui/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { SaveContext } from '@/utils/context';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow max-w-3xl w-full m-auto mb-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium text-teal-700">{title}</h3>
        <p className="text-zinc-600">{description}</p>
        {children}
      </div>
      <div className="bg-zinc-100 px-5 py-4 text-zinc-500 rounded-b-md">
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
  const { user_api, setUserApi } = useContext(SaveContext);
  const toast = useToast();

  useEffect(() => {
    setApiKey(user_api || userDetails?.user_api || '');
  }, [userDetails]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      setUserApi(apikey || '');
      updateUserApi(user, apikey || '');
      toast({
        title: 'API key saved!',
        position: 'top-right',
        description: "You have unlocked infinite messages.",
        status: 'success',
        colorScheme: 'teal',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.log('error', error);
      toast({
        title: 'Error!',
        position: 'top-right',
        description: "Please try again or contact support.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
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
      toast({
        title: 'Error!',
        position: 'top-right',
        description: "Please try again or contact support.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
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
          <a className="tab tab-lifted tab-active text-teal-700 font-semibold">
            Profile Info
          </a>
        </div>
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          Badge
        </span>
      </div>

      <Divider marginY='2' />

      <div className="flex flex-col sm:flex-row items-start justify-between">
        <ul className="mt-4 space-y-1 w-1/4 hidden sm:block">
          <li>
            <Link href="" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              Account
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

        <div className="hidden sm:block">
          <Center height={40} marginY={4}>
            <Divider orientation='vertical' />
          </Center>
        </div>

        <div className="mt-4 w-3/4">
          <Card
            title="Your API Key"
            footer={
              <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                <p className="pb-4 sm:pb-0">
                  Remember to check your usage statistics on OpenAI.
                </p>
                <form action="https://platform.openai.com/account/usage" target="_blank" rel="noopener noreferrer">
                  <button type="submit" className='btn btn-outline text-teal-700 bg-white hover:bg-teal-700 md:btn-wide rounded-full'>
                    Open usage statistics
                  </button>
                </form>
              </div>
            }
          >
            <div className='text-zinc-600'>
              Enter your API key to unlock infinite messages! Get your key 
              <Link href="https://platform.openai.com/account/api-keys" className='text-indigo-600' target="_blank" rel="noopener noreferrer">
                {" "} here.
              </Link>
            </div>
            <div className='text-zinc-600'>
              Need more help?
              <Link href="https://platform.openai.com/account/api-keys" className='text-indigo-600' target="_blank" rel="noopener noreferrer">
                {" "} Show me how to get my key.
              </Link>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="w-full">
                <div className="form-control">
                  <div className="input-group mt-8 mb-4">
                    <input 
                      type="text" 
                      spellCheck="false"
                      placeholder="Paste your API key here" 
                      className="input input-bordered w-full focus:ring-0 focus:border-teal-700 focus:outline-none" 
                      value={apikey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <button type="submit" disabled={apikey === ''} className="btn btn-square bg-teal-600 hover:bg-teal-700 ring-teal-700">
                      <PaperAirplaneIcon className={apikey === '' ? "w-5 h-5 text-black" : "w-5 h-5 text-white"} />
                    </button>
                  </div>
                </div>
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
                  For secure billing, manage your subscription on Stripe.
                </p>
                <button
                  type="submit" 
                  className='btn btn-outline text-teal-700 bg-white hover:bg-teal-700 md:btn-wide rounded-full'
                  disabled={loading || !subscription}
                  onClick={redirectToCustomerPortal}
                >
                  Open customer portal
                </button>
              </div>
            }
          >
            <div className='text-zinc-600'>
              This is your current plan. See our pricing
              <Link href="/public/pricing" className='text-indigo-600' target="_blank" rel="noopener noreferrer">
                {" "} here.
              </Link>
            </div>
            <div className='text-zinc-600'>
              You will be billed according to your plan and OpenAI's
              <Link href="https://openai.com/pricing" className='text-indigo-600' target="_blank" rel="noopener noreferrer">
                {" "} usage rates.
              </Link>
            </div>
            <div className="text-xl mt-8 mb-4 font-semibold">
              {isLoading ? (
                <div className="h-12 mb-6">
                  <LoadingDots />
                </div>
              ) : subscription ? (
                `${subscriptionPrice}/${subscription?.prices?.interval}`
              ) : (
                <Link href="/public/pricing">Choose your plan</Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    
      <div className='hidden sm:block'>
        <Box position='relative' marginTop='4'>
          <Divider />
          <AbsoluteCenter bg='white' px='4' fontSize='12' textColor='gray.200'>
            Powered by ChatGPT. Copyright © 2022 Chatterup.
          </AbsoluteCenter>
        </Box>
      </div>
    </div>
    </div>
    </section>
  );
}
