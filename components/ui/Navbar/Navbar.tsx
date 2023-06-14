import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';

import s from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="space-x-2 ml-6 hidden lg:block">
              {!user ? (
                <>
                  <Link href="/public/product" className={s.link}>
                    Product
                  </Link>
                  <Link href="/public/features" className={s.link}>
                    Features
                  </Link>
                  <Link href="/pricing" className={s.link}>
                    Pricing
                  </Link>
                  <Link href="/public/faq" className={s.link}>
                    FAQs
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/chatbot" className={s.link}>
                    Chatbot
                  </Link>
                  <Link href="/training" className={s.link}>
                    Training
                  </Link>
                  <Link href="/settings" className={s.link}>
                    Settings
                  </Link>
                  <Link href="/enterprise" className={s.link}>
                    Enterprise
                  </Link>
                  <Link href="/account" className={s.link}>
                    Account
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user ? (
              <span
                className={s.link}
                onClick={async () => {
                  await supabaseClient.auth.signOut();
                  router.push('/signin');
                }}
              >
                Sign out
              </span>
            ) : (
              <Link href="/signin" className={s.link}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;