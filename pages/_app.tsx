import { useEffect, useState } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

import Layout from '@/components/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types_db';
import { ChakraProvider } from '@chakra-ui/react'
import { SaveContext } from '@/utils/context';
import { Analytics } from '@vercel/analytics/react';

import 'styles/main.css';
import 'styles/chrome-bug.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  const [user_api, setUserApi] = useState<string>("");
  const [user_prompt, setUserPrompt] = useState<string>("");
  const [user_model, setUserModel] = useState<string>("");
  const saved = { user_api, setUserApi, user_prompt, setUserPrompt, user_model, setUserModel };

  return (
    <div className="bg-white">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <SaveContext.Provider value={saved}>
            <ChakraProvider>
              <Layout>
                <Component {...pageProps} />
                <Analytics />
              </Layout>
            </ChakraProvider>
          </SaveContext.Provider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
