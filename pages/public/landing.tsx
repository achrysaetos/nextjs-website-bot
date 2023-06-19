import Link from "next/link";
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon, ServerIcon, } from "@heroicons/react/24/outline";
import Footer from "@/components/ui/Footer/Footer";
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const features_section1 = [
  {
    name: "Unlimited chatbots.",
    description: "Create a new bot for every occasion. Teach it to invest like Warren Buffet, or to write like Shakespeare.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Unlimited messages.",
    description: "Unlock an infinite number of messages with your official ChatGPT key from OpenAI. No more limits, ever.",
    icon: LockClosedIcon,
  },
  {
    name: "Unlimited potential.",
    description: "Utilize state-of-the-art GPT models. Train your bot to become an expert in any field, then use it to help you.",
    icon: ServerIcon,
  },
];

const features_section2 = [
  {
    name: "For individuals",
    description: "Make ChatGPT your customized AI assistant. Need a conversation with a seasoned investor, a self-help coach, or a professional chef? They're all here for you.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "For creators",
    description: "Let ChatGPT inspire you. Train it on your manuscript, then ask: what might go next? Teach it to become an expert, or to write in the style of your favorite author.",
    icon: LockClosedIcon,
  },
  {
    name: "For businesses",
    description: "Let ChatGPT analyze your data, then ask it to help you with your day-to-day operations. Need a chatbot for your website? An advisor for you or your employees? Done.",
    icon: ArrowPathIcon,
  },
  {
    name: "For students",
    description: "Don't want to read 200 pages tonight? Let ChatGPT summarize it. Need to write a history paper using textbook sources? Sure, ChatGPT can do that, too.",
    icon: FingerPrintIcon,
  },
];

export default function Landing() {
  return (
    <>
      {/* Hero Section -------------------------------------------------------------------------------------------------------------- */}
      <section>
        <div className="bg-white">
          <div className="relative isolate px-6 lg:px-8">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div className="mx-auto max-w-2xl py-32 pt-48">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Announcing an UNLIMITED 1-day free trial.{" "}
                  <Link href="/public/pricing" className="font-semibold text-indigo-600">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Get started <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Customize ChatGPT for your use case
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  What if you could teach ChatGPT anything? Train it to harness the knowlege of Warren Buffet, or chat with you as Hermione Granger? Now you can.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link href="/public/pricing" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Get started
                  </Link>
                  <Link href="/public/features" className="text-sm font-semibold leading-6 text-gray-900">
                      Learn more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section -------------------------------------------------------------------------------------------------------------- */}
      <section>
        <div className="flex flex-col items-center justify-center m-auto lg:w-3/5 border border-gray-200 rounded-lg shadow">
          <ReactPlayer url='videos/demo.mp4' controls loop playing muted playbackRate={1.5} width="full" height="full"/>
        </div>
      </section>

      {/* Features Section 1 -------------------------------------------------------------------------------------------------------------- */}
      <section>
        <div className="overflow-hidden bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="lg:pr-8 lg:pt-4">
                <div className="lg:max-w-lg">
                  <h2 className="text-base font-semibold leading-7 text-indigo-600">
                    Personal AI assistant
                  </h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Trained on your data
                  </p>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Teach ChatGPT anything. Let it read articles, books, essays, papers, reports, and manuscripts. Then ask it anything. Summarize a book? Advise you on a topic? Write a document? Your custom AI expert can do it all.
                  </p>
                  <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                    {features_section1.map((feature) => (
                      <div key={feature.name} className="relative pl-9">
                        <dt className="inline font-semibold text-gray-900">
                          <feature.icon
                            className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature.name}
                        </dt>{" "}
                        <dd className="inline">{feature.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <img
                src="images/landing1.png"
                alt="Product screenshot"
                className="mt-6 w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section 2 -------------------------------------------------------------------------------------------------------------- */}
      <section>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                A bot for every use case
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for pure efficiency
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Train ChatGPT with all the knowledge you need it to have, then customize it to act exactly as you want. Endless possibilities, unlocked.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features_section2.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section -------------------------------------------------------------------------------------------------------------- */}
      <section>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                aria-hidden="true"
              >
                <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                <defs>
                  <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                    <stop stopColor="#7775D6" />
                    <stop offset={1} stopColor="#E935C1" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Pay only for what you use.
                  <br />
                  No more.
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Introducing a new pricing system tailored for your needs. Unlimited messages and chatbots with your official ChatGPT key from OpenAI.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <Link href="/public/pricing" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                      UNLIMITED 1-day trial
                  </Link>
                  <Link href="/public/features" className="text-sm font-semibold leading-6 text-white">
                      Learn more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="relative mt-16 h-80 lg:mt-8">
                <img
                  className="absolute left-0 top-8 w-[57rem] max-w-none rounded-lg bg-white/5 ring-1 ring-white/10"
                  src="images/landing2.png"
                  alt="App screenshot"
                  width={1824}
                  height={1080}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
