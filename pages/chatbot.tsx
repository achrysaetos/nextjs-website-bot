import { useRef, useState, useEffect, useMemo, useContext } from 'react';
import styles from '@/styles/chatbot.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/chat/LoadingDots';
import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient, User} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/utils/useUser';
import { Box, Divider, AbsoluteCenter, useToast } from '@chakra-ui/react';
import { SaveContext } from '@/utils/context';

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

export default function Chatbot({ user }: { user: User }) {
  const { isLoading, subscription, userDetails } = useUser();
  const { user_api, user_prompt, user_model } = useContext(SaveContext);
  const toast = useToast();

  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
  }>({
    messages: [
      {
        message: 'Hi there! What would you like to learn about this document?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, pending, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, [loading]);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!subscription && !userDetails?.onTrial) {
      toast({
        title: 'Error!',
        position: 'top-right',
        description: "Your trial has ended. Sign up for a plan?",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    if (!query) {
      toast({
        title: 'Error!',
        position: 'top-right',
        description: "Please enter a query in the message box.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const apiKey = user_api || userDetails?.user_api;
      const prompt = user_prompt || userDetails?.user_prompt;
      const model = user_model || userDetails?.user_model;
      const namespace = userDetails?.id;
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
          apiKey,
          prompt,
          model,
          namespace,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
        toast({
          title: 'Error!',
          position: 'top-right',
          description: "Check that your API key is correct.",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
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

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  // auto-scroll to bottom of messages list
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest"});
  };
  useEffect(scrollToBottom, [messages]);

  return (
    <section className="bg-white mb-8">
      <div className="flex items-center justify-between container mx-auto w-3/4">
        <div className="tabs">
          <a className="tab tab-lifted tab-active text-teal-700 font-semibold">
            Chatterup Bot
          </a>
        </div>
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          Unlimited
        </span>
      </div>

      <div className="mx-auto flex flex-col gap-4">
        <main className={styles.main}>
          <div className={styles.cloud}>
            <div ref={messageListRef} className={styles.messagelist}>
              {messages.map((message, index) => {
                let icon;
                let className;
                if (message.type === 'apiMessage') {
                  icon = (
                    <Image
                      src="/robot.png"
                      alt="AI"
                      width="40"
                      height="40"
                      className={styles.boticon}
                      priority
                    />
                  );
                  className = styles.apimessage;
                } else {
                  icon = (
                    <Image
                      src="/profile.png"
                      alt="You"
                      width="40"
                      height="40"
                      className={styles.usericon}
                      priority
                    />
                  );
                  // The latest message sent by the user will be animated while waiting for a response
                  className =
                    loading && index === messages.length - 1
                      ? styles.usermessagewaiting
                      : styles.usermessage;
                }
                return (
                  <div key={`chatMessage-${index}`} className={className} ref={messagesEndRef}>
                    {icon}
                    <div className={styles.markdownanswer}>
                      <ReactMarkdown linkTarget="_blank">
                        {message.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.center}>
            <div className={styles.cloudform}>
              <form onSubmit={handleSubmit}>
                <textarea
                  disabled={loading}
                  onKeyDown={handleEnter}
                  ref={textAreaRef}
                  autoFocus={true}
                  rows={1}
                  maxLength={512}
                  id="userInput"
                  name="userInput"
                  placeholder={
                    loading
                      ? 'Waiting for response...'
                      : 'Send a message.'
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={styles.textarea}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.generatebutton}
                >
                  {loading ? (
                    <div className={styles.loadingwheel}>
                      <LoadingDots color="#000" />
                    </div>
                  ) : (
                    // Send icon SVG in input field
                    <svg
                      viewBox="0 0 20 20"
                      className={styles.svgicon}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <div className='hidden sm:block'>
        <Box position='relative' marginTop='4'>
          <AbsoluteCenter bg='white' px='4' fontSize='12' textColor='gray.200'>
            Powered by ChatGPT. Copyright © 2023 Chatterup.
          </AbsoluteCenter>
        </Box>
      </div>
    </section>
  );
}
