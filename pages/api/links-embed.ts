import type { NextApiRequest, NextApiResponse } from 'next';
import { Document } from 'langchain/document';
import { CustomWebLoader } from '@/utils/custom_web_loader';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/utils/pinecone';

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
    const { urls, apiKey, namespace, cleartbl } = req.body;
    try {
      const rawDocs = await extractDataFromUrls(urls);
      const docs = await splitDocsIntoChunks(rawDocs);
      const embeddings = new OpenAIEmbeddings({openAIApiKey: apiKey});
      const index = (await pinecone).Index(PINECONE_INDEX_NAME);
      if (cleartbl)
        await index.delete1({
          deleteAll: true,
          namespace: namespace
        });
      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: namespace,
        textKey: 'text',
      });
      console.log('storing in pinecone... done!');
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
