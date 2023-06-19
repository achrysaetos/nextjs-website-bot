import { PropsWithChildren } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';
import Navbar from '@/components/ui/Navbar';
import Banner from '@/components/ui/Banner';

import { PageMeta } from '../types';

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const { isLoading, subscription, userDetails } = useUser();
  const router = useRouter();
  const meta = {
    title: 'Chatterup | Customize ChatGPT for your use case',
    description: 'Brought to you by Vercel, Stripe, Supabase, and OpenAI.',
    cardImage: '/og.png',
    ...pageMeta
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://subscription-starter.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      {userDetails?.user_api && <Banner />}
      <Navbar />
      <main id="skip">{children}</main>
    </>
  );
}
