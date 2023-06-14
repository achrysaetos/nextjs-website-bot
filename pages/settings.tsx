import { useState } from 'react';
import ChatLayout from '@/components/chat/Layout';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/utils/useUser';

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
  const [model, setModel] = useState<string>('gpt-3.5-turbo');
  const [text, setText] = useState<string>('');

  const linksEmbed = async (urls: string[]) => {
    setLoading(true);
    try {
      const path = '/api/links-embed';
      const res: Response = await fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(urls)
      });
      if (!res.ok) {
        console.log('Error in postData', { path, urls, res });
        throw Error(res.statusText);
      }
      console.log("Scraped and embedded the following links: ", urls);
      setLoading(false);
      return res.json();
    } catch (error) {
      setLoading(false);
      return alert((error as Error)?.message);
    }
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <ChatLayout>
      <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
        Chatbot Settings
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <div className="flex justify-between">
                  <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                    Enter Prompt
                  </label>
                  <select className="select select-ghost max-w-xs focus:outline-none">
                    <option onSelect={()=>setModel('gpt-3.5-turbo')}>gpt-3.5-turbo</option>
                    <option onSelect={()=>setModel('text-davinci-003')}>text-davinci-003</option>
                  </select>
                </div>
                <div className="mt-2">
                  <textarea
                    disabled={loading}
                    id="text"
                    name="text"
                    autoFocus={true}
                    rows={10}
                    placeholder={
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n...'
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Tell your bot how to act. The more specific the prompt, the more accurate the response.
                </p>
              </div>
            </div>
          </div>
        </div>

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
      </form>
    </ChatLayout>
  );
}
