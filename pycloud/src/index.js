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
 import "./pyodide.js";
 import pyodide_wasm from './pyodide.asm.wasm';

function sleep(milliseconds) {
	return new Promise(r=>setTimeout(r, milliseconds));
}

export default {
	async fetch(request, env, ctx) {
		let uri = new URL(request.url);
		console.log(pyodide_wasm);
		globalThis.PYODIDE_ASM_WASM = pyodide_wasm;
		globalThis.location = "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/"
		console.log("Received ", uri.pathname);
		if (uri.pathname == "/") {
			console.log("hiii?");
			let pyodide = await loadPyodide({
				indexURL: "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/"//"http://localhost:8787/"
			});
			console.log("Loaded");
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

			// Finally, let's reply with the WASM's output.
			return new Response("test");
		} else if (uri.pathname == "/pyodide.asm.wasm") {
			return await fetch("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.asm.wasm");
		} else if (uri.pathname == "/pyodide.asm.data") {
			return await fetch("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.asm.data");
		} else if (uri.pathname == "/pyodide_py.tar") {
			return await fetch("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide_py.tar");
		} else {
			return new Response("404", {"status": 404});
		}

	},
};
