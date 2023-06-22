import type { NextApiRequest, NextApiResponse } from 'next';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/utils/pinecone';

async function extractDataFromText(content: string): Promise<Document[]> {
  try {
    const cleanedContent = content.replace(/\s+/g, ' ').trim();
    const contentLength = cleanedContent?.match(/\b\w+\b/g)?.length ?? 0;
    const metadata = { source: undefined, title: undefined, date: undefined, contentLength };
    return [new Document({ pageContent: cleanedContent, metadata })];
  } catch (error) {
    console.error(`Error while extracting data from text`);
    return [];
  }
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
    const { text, apiKey, namespace, cleartbl } = req.body;
    try {
      const rawDocs = await extractDataFromText(text);
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
