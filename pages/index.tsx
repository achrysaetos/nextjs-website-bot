import Landing from '@/pages/landing';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: '/chatbot',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session
    }
  };
};

export default function Home() {
  return <Landing />;
}
