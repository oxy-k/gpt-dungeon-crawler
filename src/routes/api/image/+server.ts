import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const client = new OpenAI({
	apiKey: OPENAI_API_KEY
});

async function getImage(prompt: string) {
	return client.images.generate({
		model: 'dall-e-3',
		prompt: prompt,
		n: 1,
		size: '1024x1024'
	});
}

export async function POST({ request }) {
	const { prompt } = await request.json();
	const response = await getImage(prompt || 'a city view');
	const image_url = response.data[0].url;

	return new Response(JSON.stringify({ imgSrc: image_url }), {
		headers: {
			'Content-Type': 'application/json'
		},
		status: 200
	});
}
