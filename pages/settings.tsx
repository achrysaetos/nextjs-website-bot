import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/utils/useUser';
import { updateUserModel, updateUserPrompt } from '@/utils/supabase-client';
import { useToast } from '@chakra-ui/react';

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
    setPrompt(userDetails?.user_prompt || '');
    setModel(userDetails?.user_model || '');
  }, [userDetails]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      updateUserPrompt(user, prompt || '');
      updateUserModel(user, model || '');
      toast({
        title: 'Saved!',
        position: 'top-right',
        description: "Your bot will use these new settings.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.log('error', error);
      toast({
        title: 'Error!',
        position: 'top-right',
        description: "Could not save your settings.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <section className="bg-white mb-64">
    <div className="mx-auto flex items-center justify-start flex-col space-y-4">
    <div className="container mx-auto w-3/4">
      <div className="flex items-center justify-between">
        <div className="tabs">
          <a className="tab tab-lifted tab-active">
            Enter Prompt
          </a>
        </div>
        <select 
          className="select select-ghost max-w-xs focus:outline-none" 
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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start justify-between mt-4">
              <p className="text-sm leading-6 text-gray-600">
                Tell your bot how to act.
                <span 
                  onClick={() => {setModel(defaultModel); setPrompt(defaultPrompt)}}
                  className='cursor-pointer text-indigo-600'
                >
                  {' '} Click to reset to default.
                </span>
              </p>
              <div className="flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                {loading ? (
                  <button type="submit" disabled={loading} className="btn btn-wide">
                    <span className="loading loading-spinner"></span>
                    Saving
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn btn-outline btn-primary btn-wide">
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    </div>
    </section>
  );
}
