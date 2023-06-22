import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { OpenAI } from 'langchain/llms/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/utils/pinecone';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_FOOTER = `
Context: {context}
Question: {question}
Helpful answer in markdown:`

export const makeChain = (
  apiKey: string,
  prompt: string,
  model: string,
  vectorstore: PineconeStore,
) => {
  const QA_PROMPT = "Instructions: " + prompt.trim().replace('\n', ' ') + QA_FOOTER;
  const gptmodel = new OpenAI({
    temperature: 0.5,
    modelName: model,
    openAIApiKey: apiKey
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    gptmodel,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: false,
    },
  );
  return chain;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history, apiKey, prompt, model, namespace } = req.body;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = (await pinecone).Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({openAIApiKey: apiKey}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: namespace,
      },
    );

    const chain = makeChain(apiKey, prompt, model, vectorStore);
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    console.log('response', response);
    res.status(200).json(response);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
