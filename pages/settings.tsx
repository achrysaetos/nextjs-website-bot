import { useEffect, useState } from 'react';
import ChatLayout from '@/components/chat/Layout';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/utils/useUser';
import { updateUserModel, updateUserPrompt } from '@/utils/supabase-client';

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

  useEffect(() => {
    setPrompt(userDetails?.user_prompt || '');
    setModel(userDetails?.user_model || '');
  }, [userDetails]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      updateUserPrompt(user, prompt || '');
      updateUserModel(user, model || '');
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <section className="bg-white mb-64">
    <ChatLayout>
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

            <div className="flex items-start justify-between">
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Tell your bot how to act. The more specific the prompt, the more accurate the response.
              </p>
              <div className="mt-6 flex items-center justify-end gap-x-6">
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
    </ChatLayout>
    </section>
  );
}
