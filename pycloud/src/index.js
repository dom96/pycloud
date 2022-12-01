/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

 import "./pyodide.js";
 import pyodide_wasm from './pyodide.asm.wasm';

export default {
	async fetch(request, env, ctx) {
		let uri = new URL(request.url);
		globalThis.PYODIDE_ASM_WASM = pyodide_wasm;
		globalThis.location = "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/"
		console.log("Received ", uri.pathname);
		if (uri.pathname == "/") {
			let pyodide = await loadPyodide({
				indexURL: globalThis.location
			});
			console.log("loadPyodide completed");
			console.log(pyodide.runPython(`
				import sys
				sys.version
			`));

			await pyodide.loadPackage("micropip");
			const micropip = pyodide.pyimport("micropip");
			await micropip.install('snowballstemmer');
			pyodide.runPython(`
				import snowballstemmer
				stemmer = snowballstemmer.stemmer('english')
				print(stemmer.stemWords('go goes going gone'.split()))
			`);

			return new Response("OK");
		} else {
			return new Response("404", {"status": 404});
		}

	},
};
