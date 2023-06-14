import type { NextApiRequest, NextApiResponse } from 'next';
import { Document } from 'langchain/document';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Embeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

async function embedDocuments(
  client: SupabaseClient,
  docs: Document[],
  embeddings: Embeddings,
) {
  console.log('creating embeddings...');
  await SupabaseVectorStore.fromDocuments(client, docs, embeddings);
  console.log('storing in supabase... done!');
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      //load data from each url
      const filePath = 'public/user_files';
      const directoryLoader = new DirectoryLoader(filePath, {
        '.pdf': (path: any) => new PDFLoader(path),
      });
      const rawDocs = await directoryLoader.load();
      console.log(rawDocs);
      //split docs into chunks for openai context window
      // const docs = await splitDocsIntoChunks(rawDocs);
      //embed docs into supabase
      // await embedDocuments(supabaseClient, docs, new OpenAIEmbeddings());
      return res.status(200).json({ message: 'success' });
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
