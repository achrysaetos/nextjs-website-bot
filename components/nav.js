import Link from "next/link";
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useUser } from "../context/user";

const nav_noauth = [
  { name: 'Product', href: '/public/product' },
  { name: 'Features', href: '/public/features' },
  { name: 'Pricing', href: '/public/pricing' },
  { name: 'FAQs', href: '/public/faq' },
]

const nav_nosub = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Pricing', href: '/public/pricing' },
]

const nav_sub = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Subscription', href: '/subscription' },
]

const Nav = () => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Browser menu ------------------------------------------------------------------------------------------------------- */}
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href={user ? "/dashboard" : "/"}>
            <a className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {!!user && !user.is_subscribed && nav_nosub.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            </Link>
          ))}
          {!user && nav_noauth.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            </Link>
          ))}
          {!!user && user.is_subscribed && nav_sub.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href={user ? "/logout" : "/login"}>
            <a className="text-sm font-semibold leading-6 text-gray-900">
              {user ? "Sign Out" : "Sign In"}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </Link>
        </div>
      </nav>

      {/* Mobile menu -------------------------------------------------------------------------------------------------------- */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href={user ? "/dashboard" : "/"}>
              <a className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {!!user && !user.is_subscribed && nav_nosub.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      {item.name}
                    </a>
                  </Link>
                ))}
                {!user && nav_noauth.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      {item.name}
                    </a>
                  </Link>
                ))}
                {!!user && user.is_subscribed && nav_sub.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link href={user ? "/logout" : "/login"}>
                  <a className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    {user ? "Sign Out" : "Sign In"}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Nav;
