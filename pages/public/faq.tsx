import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import Footer from '@/components/ui/Footer';

const questions = [
  {
    q: 'What is Chatterup?',
    a: "Chatterup is a ChatGPT bot that you can teach to become anything. Since you're customizing it with your own data, you can make it your own expert AI assistant.",
    icon: CloudArrowUpIcon,
  },
  {
    q: 'Can I customize my chatbot?',
    a: "Yes, you can define the default behavior of your bot and give it personality traits and instructions on how to answer questions (ie. reply like you're Hermione).",
    icon: LockClosedIcon,
  },
  {
    q: 'What kind of data can I upload?',
    a: 'You can upload any pdf file, any website url, or copy and paste any text. For example, you can upload a book, scrape Wikipedia, and so on. The possibilities are endless!',
    icon: ArrowPathIcon,
  },
  {
    q: 'Do I get unlimited bots and messages?',
    a: 'Yes, you can use your official ChatGPT key from OpenAI to pay only for what you need, at either $0.0015 or $0.020 per 750 words! You get unlimited messages right when you sign up.',
    icon: ArrowPathIcon,
  },
  {
    q: 'What ChatGPT model is available?',
    a: 'You have access to either gpt-3.5-turbo or text-davinci-003. The latter is better at following instructions, whereas the former is more cost effective.',
    icon: FingerPrintIcon,
  },
  {
    q: 'How do I get support or request features?',
    a: 'You can email us at chatterup@proton.me for any support or feature requests. We are always happy to help!',
    icon: FingerPrintIcon,
  },
]

export default function FAQ() {
  return (
    <>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">How can we help?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              If you can't find your question, email us at chatterup@proton.me and we'll get back to you as soon as possible.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {questions.map((question) => (
                <div key={question.q} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <question.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {question.q}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{question.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}
