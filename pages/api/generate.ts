import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, size } = req.body;
  if (!prompt || !size) return res.status(400).json({ message: 'prompt and size is required' });
  const imageSize = size === 'large' ? '1024x1024' : size === 'small' ? '256x256' : '512x512';
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });
    const imageUrl = response.data.data[0].url;
    res.status(200).json(imageUrl);
  } catch (error) {
    console.log(error);
    res.status(400).json('This image could not be generated');
  }
}
