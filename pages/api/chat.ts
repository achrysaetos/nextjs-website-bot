import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { supabase } from '@/utils/supabase-client';

import { OpenAI } from 'langchain/llms/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

export const makeChain = (
  apiKey: string,
  prompt: string,
  model: string,
  vectorstore: SupabaseVectorStore,
) => {
  const QA_PROMPT = prompt;
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
  const { question, history, apiKey, prompt, model, user_idx } = req.body;

  //only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings({openAIApiKey: apiKey}), {
      client: supabase,
      tableName: "documents" + user_idx.toString(),
      queryName: "match_documents" + user_idx.toString(),
    });

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
