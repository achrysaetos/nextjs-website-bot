import Link from "next/link";

export default function Footer() {
    return(
      <footer className="bg-gray-100">
        <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="lg:flex lg:items-end lg:justify-between">
            <div>
              <div className="flex justify-center text-teal-600 lg:justify-start">
                <div className="flex lg:flex-1">
                  <Link href="/">
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
              </div>

              <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
                consequuntur amet culpa cum itaque neque.
              </p>
            </div>

            <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
              <li>
                <Link href="/public/about">
                  <a className="text-gray-700 transition hover:text-gray-700/75">
                    About
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/public/support">
                  <a className="text-gray-700 transition hover:text-gray-700/75">
                    Support
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/public/terms">
                  <a className="text-gray-700 transition hover:text-gray-700/75">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/public/privacy">
                  <a className="text-gray-700 transition hover:text-gray-700/75">
                    Privacy Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
            Copyright &copy; 2022. All rights reserved.
          </p>
        </div>
      </footer>
    )
}