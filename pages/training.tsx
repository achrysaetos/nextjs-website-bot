import { useState, ReactNode } from 'react';
import Link from 'next/link';
import ChatLayout from '@/components/chat/Layout';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';

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

export default function Training({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();
  const [tab, setTab] = useState<string>('text'); // text, links, files
  const [text, setText] = useState<string>('');
  const [links, setLinks] = useState<string>('');

  // api call to train the bot
  const trainBot = async (urls: string[]) => {
    setLoading(true);
    try {
      const path = '/api/scrape-embed';
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
    if (!links) {
      alert('Please add some links');
      return;
    }
    try {
      // replace all whitespace except newlines, split, and train
      trainBot(links.replace(/[^\S\n]+/g, '').split('\n'));
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <ChatLayout>
      <div className="tabs">
        <a className={tab === 'text' ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={() => setTab('text')} >
          Upload text
        </a>
        <a className={tab === 'links' ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={() => setTab('links')} >
          Upload links
        </a>
        <a className={tab === 'files' ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={() => setTab('files')} >
          Upload files
        </a>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {tab === 'text' && 
                <div className="col-span-full">
                  <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                    Add text
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={10}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Copy and paste text from any source.
                  </p>
                </div>
              }

              {tab === 'links' && 
                <div className="col-span-full">
                  <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                    Add links
                  </label>
                  <div className="mt-2">
                    <textarea
                      disabled={loading}
                      id="links"
                      name="links"
                      autoFocus={true}
                      rows={10}
                      placeholder={
                        'https://www.example.com\nhttps://www.example.com\nhttps://www.example.com\n...'
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={links}
                      onChange={(e) => setLinks(e.target.value)}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Upload website urls, one per line.
                  </p>
                </div>
              }

              {tab === 'files' && 
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Add files
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              }
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
              Training
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn btn-outline btn-primary btn-wide">
              Train Existing
            </button>
          )}
        </div>
      </form>
    </ChatLayout>
  );
}
