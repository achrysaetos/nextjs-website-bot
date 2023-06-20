import Logo from "@/components/icons/Logo";
import Link from "next/link";

export default function Footer() {
    return(
      <footer className="bg-gray-100">
        <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="lg:flex lg:items-end lg:justify-between">
            <div>
              <div className="flex justify-center text-teal-600 lg:justify-start">
                <div className="flex lg:flex-1">
                <Link href="/" className="cursor-pointer rounded-full transform duration-100 ease-in-out" aria-label="Logo">
                  <Logo />
                </Link>
                </div>
              </div>

              <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left">
                Chatterup, a custom ChatGPT solution for your use case. Contact us at support@chatterup.co to learn more.
              </p>
            </div>

            <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
              <li>
                <Link href="/public/features" className="text-gray-700 transition hover:text-gray-700/75">
                    About
                </Link>
              </li>
              <li>
                <Link href="/public/support" className="text-gray-700 transition hover:text-gray-700/75">
                    Support
                </Link>
              </li>
              <li>
                <Link href="/terms.html" className="text-gray-700 transition hover:text-gray-700/75">
                    Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy.html" className="text-gray-700 transition hover:text-gray-700/75">
                    Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
            Copyright &copy; 2023 Chatterup. All rights reserved.
          </p>
        </div>
      </footer>
    )
}
