import type { NextApiRequest, NextApiResponse } from 'next';
import { Document } from 'langchain/document';
import { CustomWebLoader } from '@/utils/custom_web_loader';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Embeddings, OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { deleteUserEmbeddings, supabase } from '@/utils/supabase-client';

async function extractDataFromUrl(url: string): Promise<Document[]> {
  try {
    const loader = new CustomWebLoader(url);
    const docs = await loader.load();
    return docs;
  } catch (error) {
    console.error(`Error while extracting data from ${url}: ${error}`);
    return [];
  }
}

async function extractDataFromUrls(urls: string[]): Promise<Document[]> {
  const documents: Document[] = [];
  for (const url of urls) {
    const docs = await extractDataFromUrl(url);
    documents.push(...docs);
  }
  return documents;
}

async function embedDocuments(
  client: SupabaseClient,
  docs: Document[],
  embeddings: Embeddings,
  user_idx: number
) {
  await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client,
    tableName: "documents" + user_idx.toString(),
    queryName: "match_documents" + user_idx.toString(),
  });
  console.log('storing in supabase... done!');
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { urls, apiKey, user_idx, cleartbl } = req.body;
    try {
      //load data from each url
      const rawDocs = await extractDataFromUrls(urls);
      if (cleartbl) deleteUserEmbeddings("documents" + user_idx.toString())
      //split docs into chunks for openai context window
      const docs = await splitDocsIntoChunks(rawDocs);
      //embed docs into supabase
      await embedDocuments(supabase, docs, new OpenAIEmbeddings({openAIApiKey: apiKey}), user_idx);
      return res.status(200).json({ message: rawDocs });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
