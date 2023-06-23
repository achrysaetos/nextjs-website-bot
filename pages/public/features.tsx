import { CloudArrowUpIcon, LockClosedIcon, ServerIcon, } from "@heroicons/react/24/outline";
import Footer from '@/components/ui/Footer';

export default function Features() {
  return (
    <>
      {/* Content Section -------------------------------------------------------------------------------------------------------------- */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-indigo-600">Revolutionary freedom</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">AI for the people, finally</h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                  For the first time, you'll have access to a fully customizable ChatGPT assistant, minus the exorbitant fees of other providers. Don't pay for something that should be free.
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              src="/images/landing1.png"
              alt=""
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <ul role="list" className="space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-gray-900">No subscription required.</strong> 
                      {" "} At Chatterup, we're making the cutting edge of AI research accessible for everyone. We're not here to make a quick buck. We built Chatterup for you, and together, we'll meet the future head-on.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-gray-900">Unlimited messages and chatbots.</strong> 
                      {" "} Your official ChatGPT key from OpenAI offers unparalleled flexibility for your use case. Per-message rates only apply for the messages you send - never be locked into a subscription again.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-gray-900">New customizeable AI.</strong> 
                      {" "} Train ChatGPT to power your own chatbot with custom data. For your security, don't upload sensitive information. Everything else you use to train it will guide its development and tailor it for your use case.
                    </span>
                  </li>
                </ul>
                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Pricing that doesn't rip you off</h2>
                <p className="mt-6">
                  Introducing a revolutionary, new subscription-less model where you're in complete control. You'll only be billed for the messages you send through OpenAI's official ChatGPT key, at $0.0015 per 750 words. That means you can write an entire book, or send hundreds of messages, for just a dollar. Say goodbye to the exorbitant fees of other providers!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section ---------------------------------------------------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-white mb-32 px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <img className="mx-auto h-12" src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg" alt="" />
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p>
                “ChatGPT is an incredible tool for content creators, marketers, and anyone who wants to produce high-quality, engaging content at scale.”
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                className="mx-auto h-10 w-10 rounded-full"
                src="/images/person.png"
                alt=""
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900">Lillian Pierson</div>
                <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="text-gray-600">Head of Product</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <Footer />
    </>
  )
}
