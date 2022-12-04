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
// WASM for PIL-9.1.1 library.
import sha_00cfa89075ee1a8a0d57c6fb78bb06f7b4650553a704459fa19be7958a9c4998 from
	'./packages/Pillow/00cfa89075ee1a8a0d57c6fb78bb06f7b4650553a704459fa19be7958a9c4998.wasm';
import sha_2a9f279f930b111426b502a0c16ef6505ac8f87502f89e4aa97fd32df7352512 from
	'./packages/Pillow/2a9f279f930b111426b502a0c16ef6505ac8f87502f89e4aa97fd32df7352512.wasm';
import sha_57551e57f1dcade613d57be3f6deeeb8339cea4d89c33272ee88369aba58ea29 from
	'./packages/Pillow/57551e57f1dcade613d57be3f6deeeb8339cea4d89c33272ee88369aba58ea29.wasm';
import sha_13610781f6f465cb6409bec2c1e9c10bfd0d334becdea742318d6a4c9efdae5d from
	'./packages/Pillow/13610781f6f465cb6409bec2c1e9c10bfd0d334becdea742318d6a4c9efdae5d.wasm';
import sha_ad3b1731a495444db852986f1f7df7fa9577b92f00984c2caec68f51a4a052a5 from
	'./packages/Pillow/ad3b1731a495444db852986f1f7df7fa9577b92f00984c2caec68f51a4a052a5.wasm';
import sha_d3731d3477a2bba262753090c01c96ef4a5c464bbc7f77ed9e5029453b66e3e4 from
	'./packages/Pillow/d3731d3477a2bba262753090c01c96ef4a5c464bbc7f77ed9e5029453b66e3e4.wasm';


export default {
	async fetch(request, env, ctx) {
		let uri = new URL(request.url);
		globalThis.PYODIDE_ASM_WASM = pyodide_wasm;
		globalThis.location = "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/"
		globalThis.PYODIDE_PACKAGE_WASM_MODULES = {
			"00cfa89075ee1a8a0d57c6fb78bb06f7b4650553a704459fa19be7958a9c4998":
				sha_00cfa89075ee1a8a0d57c6fb78bb06f7b4650553a704459fa19be7958a9c4998,
			"2a9f279f930b111426b502a0c16ef6505ac8f87502f89e4aa97fd32df7352512":
				sha_2a9f279f930b111426b502a0c16ef6505ac8f87502f89e4aa97fd32df7352512,
			"57551e57f1dcade613d57be3f6deeeb8339cea4d89c33272ee88369aba58ea29":
				sha_57551e57f1dcade613d57be3f6deeeb8339cea4d89c33272ee88369aba58ea29,
			"13610781f6f465cb6409bec2c1e9c10bfd0d334becdea742318d6a4c9efdae5d":
				sha_13610781f6f465cb6409bec2c1e9c10bfd0d334becdea742318d6a4c9efdae5d,
			"ad3b1731a495444db852986f1f7df7fa9577b92f00984c2caec68f51a4a052a5":
				sha_ad3b1731a495444db852986f1f7df7fa9577b92f00984c2caec68f51a4a052a5,
			"d3731d3477a2bba262753090c01c96ef4a5c464bbc7f77ed9e5029453b66e3e4":
				sha_d3731d3477a2bba262753090c01c96ef4a5c464bbc7f77ed9e5029453b66e3e4
		};
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
			await micropip.install('pillow');
			pyodide.runPython(`
				from PIL import Image
				img = Image.new(mode="RGB", size=(800, 600), color=(231, 136, 59))
				img.save("/result.png")
			`);

			let file = pyodide.FS.readFile("/result.png", { encoding: "binary" });

			return new Response(file, {
				headers: new Headers({
					'Content-Type': 'image/png'
				})
			});
		} else {
			return new Response("404", {"status": 404});
		}

	},
};
