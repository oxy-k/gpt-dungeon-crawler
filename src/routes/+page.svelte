<script lang="ts">
    import { onMount } from "svelte"
    import SvelteMarkdown from 'svelte-markdown'
    import imgBg from '$lib/images/bg-image.png';

    let imgSrc: string = ""
    let loading: boolean = false
    let error: Error | undefined
    let answer: string = ""
    let text: string = ""

    async function generateImage(s: string) {
        loading = true
        error = undefined

        try {
            const response = await fetch('/api/image', {
                method: 'POST',
                body: JSON.stringify({ prompt: s }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            const json = await response.json()
            imgSrc = json.imgSrc
            text = s
        } catch (e: any) {
            error = e
        }
        loading = false
    }

    async function generateText() {
        loading = true
        error = undefined

        try {
            const response = await fetch('/api/text', {
                method: 'POST',
                body: JSON.stringify({ prompt: answer }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            const json = await response.json()
            await generateImage(json.response)
        } catch (e: any) {
            error = e
        }
        answer = ""
    }

    onMount(async () => {
        await generateText()
    })


</script>

<svelte:head>
	<title>GPT Dungeon Crawler</title>
	<meta name="description" content="GPT Dungeon Crawler example app" />
</svelte:head>

<section>
    <div class="text">
        <h1>GPT Dungeon Crawler</h1>
        <hr>

        {#if text}
            <SvelteMarkdown source={text} />

            {#if error}
                <div class="error">{error}</div>
            {/if}

            <div class="input">
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
    <div class="img" style="background-image: url({imgSrc || imgBg})"></div>
</section>

<style>
	section {
        display: flex;
        width: 100%;
        min-height: 100vh;
		flex: 0.6;
	}

    .img {
        position: fixed;
        right: 0;
        top: 0;
        width: 50%;
        height: 100%;
        background-attachment: fixed;
        background-color: var(--color-bg-1);
        background-size: cover;
        background-position: center center;
    }

	h1 {
        margin: 0;
		width: 100%;
        color: #cec0ac;
        text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.6);
        font-size: 1.2rem;
        font-family: monospace;
	}

    hr {
        background: #cec0ac;
        width: 10%;
    }

    .error {
        color: red;
    }

    .input {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .text {
        width: 50%;
        white-space: pre-line;
        background: rgba(26, 26, 26, 1);
        color: #dadada;
        padding: 1rem;
    }
</style>
