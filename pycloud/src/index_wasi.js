/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

 import { WASI } from "@cloudflare/workers-wasi";
 import demoWasm from "./output.wasm";

export default {
	async fetch(request, env, ctx) {
		// Creates a TransformStream we can use to pipe our stdout to our response body.
		const stdout = new TransformStream();
		const wasi = new WASI({
			args: ["version"],
			stdin: request.body,
			stdout: stdout.writable,
		});

		// Instantiate our WASM with our demo module and our configured WASI import.
		const instance = new WebAssembly.Instance(demoWasm, {
			wasi_unstable: wasi.wasiImport,
		});

		// Keep our worker alive until the WASM has finished executing.
		ctx.waitUntil(wasi.start(instance));

		// Finally, let's reply with the WASM's output.
		return new Response(stdout.readable);
	},
};
