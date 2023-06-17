import { useContext, useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/utils/useUser';
import { updateUserModel, updateUserPrompt } from '@/utils/supabase-client';
import { AbsoluteCenter, Box, Divider, Tooltip, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { SaveContext } from '@/utils/context';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

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

export default function Settings({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();
  const [model, setModel] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { user_prompt, setUserPrompt, user_model, setUserModel } = useContext(SaveContext);
  const toast = useToast()

  const defaultModel = 'gpt-3.5-turbo';
  const defaultPrompt = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:
`;

  useEffect(() => {
    setPrompt(user_prompt || userDetails?.user_prompt || '');
    setModel(user_model || userDetails?.user_model || '');
  }, [userDetails]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      setUserPrompt(prompt || '');
      setUserModel(model || '');
      updateUserPrompt(user, prompt || '');
      updateUserModel(user, model || '');
      toast({
        title: 'Saved!',
        position: 'top-right',
        description: "Your bot will use these new settings.",
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

  return (
    <section className="bg-white mb-8">
    <div className="mx-auto flex items-center justify-start flex-col space-y-4">
    <div className="container mx-auto w-3/4">
      <div className="flex items-center justify-between">
        <div className="tabs">
          <a className="tab tab-lifted tab-active text-teal-700 font-semibold mb-2">
            Enter Prompt
          </a>
        </div>
        <Tooltip 
          label={model === 'gpt-3.5-turbo' ? "Less powerful, but less expensive" : "More powerful, but more expensive."}
          placement='bottom-end'
          bg='teal'
          w={40}
        >
        <select 
          className="text-sm font-semibold border-none focus:outline-none focus:border-none focus:ring-0 focus:text-teal-700 text-teal-700" 
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value='gpt-3.5-turbo'>
            gpt-3.5-turbo
          </option>
          <option value='text-davinci-003'>
            text-davinci-003
          </option>
        </select>
        </Tooltip>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <textarea
              disabled={loading}
              id="text"
              name="text"
              autoFocus={true}
              rows={15}
              placeholder={
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n...'
              }
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-teal-700 sm:text-sm sm:leading-6"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-start justify-between mt-4">
          <div>
            <div className="flex items-center">
              <p className="text-sm leading-6 text-gray-600">
                Tell your bot how to act and respond to questions.
              </p>
              <Tooltip 
                label={"The more specific you are, the better your bot will be."}
                placement='right-start'
                bg='teal'
                w={72}
              >
                <InformationCircleIcon className='text-sm leading-6 text-gray-300 inline h-4 w-4 ml-1' />
              </Tooltip>
            </div>
            <span 
              onClick={() => {setModel(defaultModel); setPrompt(defaultPrompt)}}
              className='text-sm leading-6 cursor-pointer text-teal-700 font-semibold select-none'
            >
              Click to reset to default.
            </span>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <Link href="/" className="text-sm font-semibold leading-6 text-gray-900 hover:text-teal-700">
              Cancel
            </Link>
            {loading ? (
              <button type="submit" disabled={loading} className="btn btn-primary md:btn-wide rounded-full">
                <span className="loading loading-spinner"></span>
                Saving
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={
                  loading || 
                  prompt === '' ||
                  (prompt === userDetails?.user_prompt && model === userDetails?.user_model)
                }
                className={
                  loading || 
                  prompt === '' ||
                  (prompt === userDetails?.user_prompt && model === userDetails?.user_model)
                  ? "btn btn-primary md:btn-wide rounded-full"
                  : "btn btn-outline text-teal-700 hover:bg-teal-700 md:btn-wide rounded-full"
                }
              >
                Save
              </button>
            )}
          </div>
        </div>
      </form>

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
