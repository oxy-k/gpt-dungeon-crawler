<script lang="ts">
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import 'doodle.css/doodle.css';
	import imgBg from '$lib/images/bg-image.png';

	let imgSrc: string = '';
	let loading: boolean = false;
	let error: Error | undefined;
	let answer: string = '';
	let text: string = '';

	async function generateImage(s: string) {
		loading = true;
		error = undefined;

		try {
			const response = await fetch('/api/image', {
				method: 'POST',
				body: JSON.stringify({ prompt: s }),
				headers: {
					'content-type': 'application/json'
				}
			});
			const json = await response.json();
			imgSrc = json.imgSrc;
			text = s;
			window.scrollTo(0, 0);
		} catch (e: any) {
			error = e;
		}
		loading = false;
	}

	async function generateText() {
		loading = true;
		error = undefined;

		try {
			const response = await fetch('/api/text', {
				method: 'POST',
				body: JSON.stringify({ prompt: answer }),
				headers: {
					'content-type': 'application/json'
				}
			});
			const json = await response.json();
			await generateImage(json.response);
		} catch (e: any) {
			error = e;
		}
		answer = '';
	}

	onMount(async () => {
		await generateText();
	});
</script>

<svelte:head>
	<title>GPT Dungeon Crawler</title>
	<meta name="description" content="GPT Dungeon Crawler example app" />
</svelte:head>

<section>
	<h1>GPT Dungeon Crawler</h1>
	<div class="img" style="background-image: url({imgSrc || imgBg})"></div>

	<div class="text">
		{#if text}
			<SvelteMarkdown source={text} />

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<div class="input doodle">
				<input bind:value={answer} placeholder="Your answer" />
				<button on:click={generateText} disabled={loading}>
					{#if !loading}
						submit
					{:else}
						loading...
					{/if}
				</button>
			</div>
		{:else}
			Loading ...
		{/if}
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100vh;
		background: rgba(26, 26, 26, 1);
	}

	.img {
		height: 760px;
		background-attachment: fixed;
		background: rgb(33, 33, 33);
		background-size: cover;
		background-position: center center;
	}

	h1 {
		width: 100%;
		color: #cec0ac;
		text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.6);
		font-size: 1.2rem;
		font-family: serif;
	}

	.error {
		color: red;
	}

	.input {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.doodle {
		background: transparent;
		color: white;
	}

	.doodle input {
		border-color: white;
		font-family: 'Caveat', cursive;
		color: #e8e8e8;
	}

	.doodle button {
		color: rgb(129, 129, 129);
		font-family: 'Caveat', cursive;
		cursor: pointer;
	}

	.text {
		white-space: pre-line;
		background: rgba(26, 26, 26, 1);
		color: #dadada;
		padding: 0.8rem 2rem;
	}
</style>
