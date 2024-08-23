import OpenAI from 'openai';
import { OPENAI_API_KEY, END_STORY_COUNT } from '$env/static/private';

const client = new OpenAI({
	apiKey: OPENAI_API_KEY
});
const systemPrompt =
	'Pretend you are a text based dungeon crawler, create a story for the beginning of my dungeon quest. For every answer give me options on how to proceed. Once I answer with one of the provided answers continue the story and give me more options and so on.';
const endStoryCount = parseInt(END_STORY_COUNT) || 10;
let answers: string[] = [];

async function getText(answer: string) {
	if (!answer) answers = [];

	const messages: {
		role: 'system' | 'user' | 'assistant';
		content: string;
	}[] = [];
	if (!answer)
		messages.push({
			role: 'system',
			content: systemPrompt
		});
	if (answers.length)
		answers.forEach((answer) =>
			messages.push({
				role: 'assistant',
				content: answer
			})
		);
	if (answer)
		messages.push({
			role: 'user',
			content: answer
		});
	if (answers.length >= endStoryCount) {
		messages.push({
			role: 'user',
			content:
				'Given the provided answer, conclude the dungeon crawler story with a final ending and do not provide more options.'
		});
	}

	const completion = await client.chat.completions.create({
		messages,
		model: 'gpt-4o-mini'
	});
	return completion.choices[0].message.content;
}

export async function POST({ request }) {
	const { prompt } = await request.json();
	const response = await getText(prompt);
	answers.push(response as string);

	return new Response(
		JSON.stringify({
			response,
			page: `${answers.length} of ${endStoryCount + 1}`,
			isEnd: answers.length > endStoryCount
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			},
			status: 200
		}
	);
}
