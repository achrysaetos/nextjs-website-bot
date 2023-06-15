import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/utils/useUser';
import { PickerOverlay } from 'filestack-react';
import { AbsoluteCenter, Box, Divider, useToast } from '@chakra-ui/react';

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
  const [trainNew, setTrainNew] = useState<boolean>(false);
  
  const [text, setText] = useState<string>('');
  const [scrapedText, setScrapedText] = useState<string>('');
  const [links, setLinks] = useState<string>('');
  const [scrapedLinks, setScrapedLinks] = useState<string>('');
  const [files, setFiles] = useState<any>('');
  const [scrapedFiles, setScrapedFiles] = useState<string>('');

  const toast = useToast();
  
  const textEmbed = async (text: string) => {
    setScrapedText('');
    setLoading(true);
    try {
      const path = '/api/text-embed';
      const apiKey = userDetails?.user_api;
      const res: Response = await fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({text, apiKey})
      });
      if (!res.ok) {
        console.log('Error in postData', { path, text, res });
        throw Error(res.statusText);
      }
      const response = await res.json();
      setScrapedText(response.message[0].pageContent)
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      return alert((error as Error)?.message);
    }
  };

  const linksEmbed = async (urls: string[]) => {
    setScrapedLinks('');
    setLoading(true);
    try {
      const path = '/api/links-embed';
      const apiKey = userDetails?.user_api;
      const res: Response = await fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({urls, apiKey})
      });
      if (!res.ok) {
        console.log('Error in postData', { path, urls, res });
        throw Error(res.statusText);
      }
      const response = await res.json();
      setScrapedLinks(response.message[0].pageContent)
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      return alert((error as Error)?.message);
    }
  };

  const filesEmbed = async (text: string) => {
    setScrapedFiles('');
    setLoading(true);
    try {
      const path = '/api/text-embed';
      const apiKey = userDetails?.user_api;
      const res: Response = await fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({text, apiKey})
      });
      if (!res.ok) {
        console.log('Error in postData', { path, text, res });
        throw Error(res.statusText);
      }
      const response = await res.json();
      setScrapedFiles(response.message[0].pageContent)
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      return alert((error as Error)?.message);
    }
  };

  const scrapeAndEmbedFiles = async (files: any) => {
    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    let fullText = '';
    for (const file of files) {
      let doc = await pdfjs.getDocument(file.url).promise;
      let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
          return (await (await doc.getPage(i+1)).getTextContent()).items.map((token:any) => token.str).join(' ');
      });
      const text = (await Promise.all(pageTexts)).join('');
      fullText += text + '\n';
    }
    filesEmbed(fullText)
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      // replace all whitespace except newlines, split, and train
      switch (tab) {
        case 'text':
          if (!text) {
            alert('Please add some text');
            return;
          }
          textEmbed(text);
          break;
        case 'links':
          if (!links) {
            alert('Please add some links');
            return;
          }
          linksEmbed(links.replace(/[^\S\n]+/g, '').split('\n'));
          break;
        case 'files':
          if (!files) {
            alert('Please add some files');
            return;
          }
          scrapeAndEmbedFiles(files)
          break;
        default:
          break;
      }
      toast({
        title: 'Trained new bot!',
        position: 'top-right',
        description: "All training sessions will now use this bot.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.log('error', error);
      toast({
        title: 'Error!',
        position: 'top-right',
        description: "Could not train your bot.",
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
          <a className={tab === 'text' ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={() => setTab('text')} >
            Upload Text
          </a>
          <a className={tab === 'links' ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={() => setTab('links')} >
            Upload Links
          </a>
          <a className={tab === 'files' ? "tab tab-lifted tab-active" : "tab tab-lifted"} onClick={() => setTab('files')} >
            Upload Files
          </a>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text mr-4">Train new bot</span> 
            <input 
              type="checkbox" 
              checked={trainNew} 
              className="checkbox checkbox-sm checkbox-success" 
              onChange={() => setTrainNew(!trainNew)}
            />
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {tab === 'text' && 
            <div className="col-span-full">
              <textarea
                disabled={scrapedText != ''}
                autoFocus={true}
                rows={15}
                placeholder={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n...'
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={scrapedText === '' ? text : scrapedText}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          }

          {tab === 'links' && 
            <div className="col-span-full">
              <textarea
                disabled={scrapedLinks != ''}
                autoFocus={true}
                rows={15}
                placeholder={
                  'https://www.example.com\nhttps://www.example.com\nhttps://www.example.com\n...'
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={scrapedLinks === '' ? links : scrapedLinks}
                onChange={(e) => setLinks(e.target.value)}
              />
            </div>
          }

          {tab === 'files' && 
            <>
              {!files ?
                <>
                  <div className="col-span-full">
                    <textarea
                      disabled={false}
                      autoFocus={true}
                      rows={15}
                      placeholder={
                        'No files yet...'
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={''}
                      onChange={(e) => console.log('done')}
                    />
                  </div>
                  {/* <PickerOverlay
                    apikey={'Al9uEt8XQ067ONx51odaNz'}
                    pickerOptions={{maxFiles: 10, accept: 'application/pdf'}}
                    onSuccess={(res:any) => setFiles(res.filesUploaded)}
                    onUploadDone={(res:any) => setFiles(res.filesUploaded)}
                  /> */}
                </>
              :
                <div className="col-span-full">
                  {scrapedFiles === '' ? 
                    <>
                      <div className="h-64 block w-full rounded-md border-2 border-indigo-600 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {files.map((file:any) => (
                          <p key={file.url} className='text-sm text-base/loose text-green-500 pl-2'>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              {file.filename} ({(file.size/1000000).toFixed(1)}mb)
                            </a>
                          </p>
                        ))}
                      </div>
                    </>
                  :
                    <>
                      <textarea
                        disabled={scrapedFiles != ''}
                        autoFocus={true}
                        rows={15}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={scrapedFiles === '' ? links : scrapedFiles}
                      />
                    </>
                  }
                </div>
              }
            </>
          }
        </div>
        
        <div className="flex items-start justify-between">
          {tab === 'text' && 
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {scrapedText === '' ? 'Copy and paste text from any source.' : 'The data from your text upload.'}
              {scrapedText != '' && 
                <span 
                  onClick={() => {setText(''); setScrapedText('')}}
                  className='cursor-pointer text-indigo-600'
                >
                  {' '} Click to add new text.
                </span>
              }
            </p>
          }
          {tab === 'links' &&
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {scrapedLinks === '' ? 'Upload website urls, one per line.' : 'The data from your link uploads.'}
              {scrapedLinks != '' && 
                <span 
                  onClick={() => {setLinks(''); setScrapedLinks('')}}
                  className='cursor-pointer text-indigo-600'
                >
                  {' '} Click to add new links.
                </span>
              }
            </p>
          }
          {tab === 'files' && (!files ? 
            <p className="mt-3 text-sm leading-6 text-gray-600">Upload any number of pdf files, up to 20mb each.</p>
          :
            scrapedFiles === '' ?
              <p className="mt-3 text-sm leading-6 text-gray-600">Upload any number of pdf files, up to 20mb each.</p>
            :
              <p className="mt-3 text-sm leading-6 text-gray-600">
                The data from your file uploads.
                <span 
                  onClick={() => {setFiles(''); setScrapedFiles('')}}
                  className='cursor-pointer text-indigo-600'
                >
                  {' '} Click to add new files.
                </span>
              </p>
          )}
          <div className="flex items-center justify-end gap-x-6 mt-4">
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
              <button 
                type="submit" 
                disabled={
                  loading || 
                  (tab === 'text' && (!text || scrapedText != '')) ||
                  (tab === 'links' && (!links || scrapedLinks!= '')) ||
                  (tab === 'files' && (!files || scrapedFiles!= ''))
                }
                className={
                  (loading || 
                  (tab === 'text' && (!text || scrapedText != '')) ||
                  (tab === 'links' && (!links || scrapedLinks!= '')) ||
                  (tab === 'files' && (!files || scrapedFiles!= '')))
                  ? "btn btn-primary btn-wide rounded-full"
                  : "btn btn-outline btn-primary btn-wide rounded-full"
                }
              >
                Train
              </button>
            )}
          </div>
        </div>
      </form>

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
