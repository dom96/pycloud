// This is a (hacky) implementation of Pyodide on Cloudflare Workers.
//
// For more info see the readme. Licensed under MPL 2.0.

import index from './index.html';
import "./pyodide.js";
// We need to pre-load a bunch of WASM because Cloudflare Workers does not allow
// dynamic execution of WebAssembly.
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
// WASM for Matplotlib library.
import sha_01c93b905e29ccb3d171f036b86d993da372d1b2f588abce244d9dd95f2e71b6 from './packages/matplotlib/01c93b905e29ccb3d171f036b86d993da372d1b2f588abce244d9dd95f2e71b6.wasm';
import sha_113c4866263de63967f66b85f5bf958f73e6856f4086aaca3d23fb314e081b41 from './packages/matplotlib/113c4866263de63967f66b85f5bf958f73e6856f4086aaca3d23fb314e081b41.wasm';
import sha_120e7b486b669b473a433c3257901ad8a5fc33c9c2679a3dcfc86cb919b68afd from './packages/matplotlib/120e7b486b669b473a433c3257901ad8a5fc33c9c2679a3dcfc86cb919b68afd.wasm';
import sha_12bcce3d200d63ee170d9deedae9e79bd96f41101f3428b0a6f158068257e62f from './packages/matplotlib/12bcce3d200d63ee170d9deedae9e79bd96f41101f3428b0a6f158068257e62f.wasm';
import sha_14508e416a9a31f618869a6a1c7dddea1a3b6e9aa3e6fc74235a1a2852436828 from './packages/matplotlib/14508e416a9a31f618869a6a1c7dddea1a3b6e9aa3e6fc74235a1a2852436828.wasm';
import sha_1a121ba621799efc96ed1f1d11725951cf08fcc8e3a38be4b39def8bee89c16a from './packages/matplotlib/1a121ba621799efc96ed1f1d11725951cf08fcc8e3a38be4b39def8bee89c16a.wasm';
import sha_2ad03c6772c1fce712662aaa7150b498010d80c2d07e838034b6231a641f9b62 from './packages/matplotlib/2ad03c6772c1fce712662aaa7150b498010d80c2d07e838034b6231a641f9b62.wasm';
import sha_35c52e8d9cb6d188956daba7a728359ab24d60f4b561684fdedcf1aec551368d from './packages/matplotlib/35c52e8d9cb6d188956daba7a728359ab24d60f4b561684fdedcf1aec551368d.wasm';
import sha_5281ae5d5eee3e67e660c7b8d0ea7dcb5ebbdb976d1a931f56454fefb8c07ae6 from './packages/matplotlib/5281ae5d5eee3e67e660c7b8d0ea7dcb5ebbdb976d1a931f56454fefb8c07ae6.wasm';
import sha_5934c6708422d59a18c0c627c0844a5d7dab85ff8f510d47af9c566c691d5f85 from './packages/matplotlib/5934c6708422d59a18c0c627c0844a5d7dab85ff8f510d47af9c566c691d5f85.wasm';
import sha_5bcb21802a937f627ab910cfc443d8d8de59fa05f52b80b912564374e7d57397 from './packages/matplotlib/5bcb21802a937f627ab910cfc443d8d8de59fa05f52b80b912564374e7d57397.wasm';
import sha_67d2ddb11bd371cfcec73a526b96000a684cafc2ff28d2be8d3548714dc5ab2f from './packages/matplotlib/67d2ddb11bd371cfcec73a526b96000a684cafc2ff28d2be8d3548714dc5ab2f.wasm';
import sha_766075781e6f478858eb8e9dd3d541e29911f53c831d85a21cd9aa2950dc10c2 from './packages/matplotlib/766075781e6f478858eb8e9dd3d541e29911f53c831d85a21cd9aa2950dc10c2.wasm';
import sha_779fa1d41afc02e5458a0f6fd9fbc9fb84334325306e7062b6026646ca507805 from './packages/matplotlib/779fa1d41afc02e5458a0f6fd9fbc9fb84334325306e7062b6026646ca507805.wasm';
import sha_7a42da617cc90857439b0ae74355c334c4ce5465ecb7f447d68756f28193317d from './packages/matplotlib/7a42da617cc90857439b0ae74355c334c4ce5465ecb7f447d68756f28193317d.wasm';
import sha_80b1aefe410527ca9d99f06424df1d74efbc146ec1165bcc608bee8eaae1b5b6 from './packages/matplotlib/80b1aefe410527ca9d99f06424df1d74efbc146ec1165bcc608bee8eaae1b5b6.wasm';
import sha_8f096a340f05ad28b832869c0e5c7e109e0b6fb948b9b95ce03cd34c8568d103 from './packages/matplotlib/8f096a340f05ad28b832869c0e5c7e109e0b6fb948b9b95ce03cd34c8568d103.wasm';
import sha_9377c37c3369c3446903dcbdc1cb6715c10ddeced2d7e7909547f11b2556b5c5 from './packages/matplotlib/9377c37c3369c3446903dcbdc1cb6715c10ddeced2d7e7909547f11b2556b5c5.wasm';
import sha_941358c2c3d5ef56af30804c90c07eb113fc97bb8786b3b04b5fee995b1b22d3 from './packages/matplotlib/941358c2c3d5ef56af30804c90c07eb113fc97bb8786b3b04b5fee995b1b22d3.wasm';
import sha_bc4934252f291a652360e94674abf9dd2288789589579a5bf097f43dd9f93fff from './packages/matplotlib/bc4934252f291a652360e94674abf9dd2288789589579a5bf097f43dd9f93fff.wasm';
import sha_c472fa8d9c195d99f64fab694750afe89dd7eaef35770a68e75631909a68ea86 from './packages/matplotlib/c472fa8d9c195d99f64fab694750afe89dd7eaef35770a68e75631909a68ea86.wasm';
import sha_c52c6e1e5c8524cd162c3c992fa66385227472c8c399e517f92079c55a6089db from './packages/matplotlib/c52c6e1e5c8524cd162c3c992fa66385227472c8c399e517f92079c55a6089db.wasm';
import sha_c6d6e877567c72155b42aaf3e0924244eeae39e281e32623199cf0265f770eb5 from './packages/matplotlib/c6d6e877567c72155b42aaf3e0924244eeae39e281e32623199cf0265f770eb5.wasm';
import sha_cdaf4383a4ed73adbdc124d71a5983671b5c21ce55a9b09dd181fdbff6c3d1dc from './packages/matplotlib/cdaf4383a4ed73adbdc124d71a5983671b5c21ce55a9b09dd181fdbff6c3d1dc.wasm';
import sha_cf4f5449436ad6713d63ef107323e5880aac791cdc620be3713de307a18eb417 from './packages/matplotlib/cf4f5449436ad6713d63ef107323e5880aac791cdc620be3713de307a18eb417.wasm';
import sha_d1d5cc5f999677398d5ae6cadb18da2a45d2c84f590f4ab7c7df507d42d7b722 from './packages/matplotlib/d1d5cc5f999677398d5ae6cadb18da2a45d2c84f590f4ab7c7df507d42d7b722.wasm';
import sha_e9cb499e185d9ea99ae67bde08397c4e680c8719811066c75fc1b86913238cb2 from './packages/matplotlib/e9cb499e185d9ea99ae67bde08397c4e680c8719811066c75fc1b86913238cb2.wasm';
import sha_ec2fffb28ac27ac603b85e1dd676c1d24973158b8faa9e9db348febb87e28d63 from './packages/matplotlib/ec2fffb28ac27ac603b85e1dd676c1d24973158b8faa9e9db348febb87e28d63.wasm';
import sha_f22c9a7559a07c3c3d273d2d4633825e96224cda5ac031e44069023de94ec4d5 from './packages/matplotlib/f22c9a7559a07c3c3d273d2d4633825e96224cda5ac031e44069023de94ec4d5.wasm';
import sha_f4c3a5a29db5da34364a4062d4f05cb32a96accb20a0aa7a78e06f8528da22bd from './packages/matplotlib/f4c3a5a29db5da34364a4062d4f05cb32a96accb20a0aa7a78e06f8528da22bd.wasm';

async function initPy() {
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
      sha_d3731d3477a2bba262753090c01c96ef4a5c464bbc7f77ed9e5029453b66e3e4,
    "01c93b905e29ccb3d171f036b86d993da372d1b2f588abce244d9dd95f2e71b6":
      sha_01c93b905e29ccb3d171f036b86d993da372d1b2f588abce244d9dd95f2e71b6,
    "113c4866263de63967f66b85f5bf958f73e6856f4086aaca3d23fb314e081b41":
      sha_113c4866263de63967f66b85f5bf958f73e6856f4086aaca3d23fb314e081b41,
    "120e7b486b669b473a433c3257901ad8a5fc33c9c2679a3dcfc86cb919b68afd":
      sha_120e7b486b669b473a433c3257901ad8a5fc33c9c2679a3dcfc86cb919b68afd,
    "12bcce3d200d63ee170d9deedae9e79bd96f41101f3428b0a6f158068257e62f":
      sha_12bcce3d200d63ee170d9deedae9e79bd96f41101f3428b0a6f158068257e62f,
    "14508e416a9a31f618869a6a1c7dddea1a3b6e9aa3e6fc74235a1a2852436828":
      sha_14508e416a9a31f618869a6a1c7dddea1a3b6e9aa3e6fc74235a1a2852436828,
    "1a121ba621799efc96ed1f1d11725951cf08fcc8e3a38be4b39def8bee89c16a":
      sha_1a121ba621799efc96ed1f1d11725951cf08fcc8e3a38be4b39def8bee89c16a,
    "2ad03c6772c1fce712662aaa7150b498010d80c2d07e838034b6231a641f9b62":
      sha_2ad03c6772c1fce712662aaa7150b498010d80c2d07e838034b6231a641f9b62,
    "35c52e8d9cb6d188956daba7a728359ab24d60f4b561684fdedcf1aec551368d":
      sha_35c52e8d9cb6d188956daba7a728359ab24d60f4b561684fdedcf1aec551368d,
    "5281ae5d5eee3e67e660c7b8d0ea7dcb5ebbdb976d1a931f56454fefb8c07ae6":
      sha_5281ae5d5eee3e67e660c7b8d0ea7dcb5ebbdb976d1a931f56454fefb8c07ae6,
    "5934c6708422d59a18c0c627c0844a5d7dab85ff8f510d47af9c566c691d5f85":
      sha_5934c6708422d59a18c0c627c0844a5d7dab85ff8f510d47af9c566c691d5f85,
    "5bcb21802a937f627ab910cfc443d8d8de59fa05f52b80b912564374e7d57397":
      sha_5bcb21802a937f627ab910cfc443d8d8de59fa05f52b80b912564374e7d57397,
    "67d2ddb11bd371cfcec73a526b96000a684cafc2ff28d2be8d3548714dc5ab2f":
      sha_67d2ddb11bd371cfcec73a526b96000a684cafc2ff28d2be8d3548714dc5ab2f,
    "766075781e6f478858eb8e9dd3d541e29911f53c831d85a21cd9aa2950dc10c2":
      sha_766075781e6f478858eb8e9dd3d541e29911f53c831d85a21cd9aa2950dc10c2,
    "779fa1d41afc02e5458a0f6fd9fbc9fb84334325306e7062b6026646ca507805":
      sha_779fa1d41afc02e5458a0f6fd9fbc9fb84334325306e7062b6026646ca507805,
    "7a42da617cc90857439b0ae74355c334c4ce5465ecb7f447d68756f28193317d":
      sha_7a42da617cc90857439b0ae74355c334c4ce5465ecb7f447d68756f28193317d,
    "80b1aefe410527ca9d99f06424df1d74efbc146ec1165bcc608bee8eaae1b5b6":
      sha_80b1aefe410527ca9d99f06424df1d74efbc146ec1165bcc608bee8eaae1b5b6,
    "8f096a340f05ad28b832869c0e5c7e109e0b6fb948b9b95ce03cd34c8568d103":
      sha_8f096a340f05ad28b832869c0e5c7e109e0b6fb948b9b95ce03cd34c8568d103,
    "9377c37c3369c3446903dcbdc1cb6715c10ddeced2d7e7909547f11b2556b5c5":
      sha_9377c37c3369c3446903dcbdc1cb6715c10ddeced2d7e7909547f11b2556b5c5,
    "941358c2c3d5ef56af30804c90c07eb113fc97bb8786b3b04b5fee995b1b22d3":
      sha_941358c2c3d5ef56af30804c90c07eb113fc97bb8786b3b04b5fee995b1b22d3,
    "bc4934252f291a652360e94674abf9dd2288789589579a5bf097f43dd9f93fff":
      sha_bc4934252f291a652360e94674abf9dd2288789589579a5bf097f43dd9f93fff,
    "c472fa8d9c195d99f64fab694750afe89dd7eaef35770a68e75631909a68ea86":
      sha_c472fa8d9c195d99f64fab694750afe89dd7eaef35770a68e75631909a68ea86,
    "c52c6e1e5c8524cd162c3c992fa66385227472c8c399e517f92079c55a6089db":
      sha_c52c6e1e5c8524cd162c3c992fa66385227472c8c399e517f92079c55a6089db,
    "c6d6e877567c72155b42aaf3e0924244eeae39e281e32623199cf0265f770eb5":
      sha_c6d6e877567c72155b42aaf3e0924244eeae39e281e32623199cf0265f770eb5,
    "cdaf4383a4ed73adbdc124d71a5983671b5c21ce55a9b09dd181fdbff6c3d1dc":
      sha_cdaf4383a4ed73adbdc124d71a5983671b5c21ce55a9b09dd181fdbff6c3d1dc,
    "cf4f5449436ad6713d63ef107323e5880aac791cdc620be3713de307a18eb417":
      sha_cf4f5449436ad6713d63ef107323e5880aac791cdc620be3713de307a18eb417,
    "d1d5cc5f999677398d5ae6cadb18da2a45d2c84f590f4ab7c7df507d42d7b722":
      sha_d1d5cc5f999677398d5ae6cadb18da2a45d2c84f590f4ab7c7df507d42d7b722,
    "e9cb499e185d9ea99ae67bde08397c4e680c8719811066c75fc1b86913238cb2":
      sha_e9cb499e185d9ea99ae67bde08397c4e680c8719811066c75fc1b86913238cb2,
    "ec2fffb28ac27ac603b85e1dd676c1d24973158b8faa9e9db348febb87e28d63":
      sha_ec2fffb28ac27ac603b85e1dd676c1d24973158b8faa9e9db348febb87e28d63,
    "f22c9a7559a07c3c3d273d2d4633825e96224cda5ac031e44069023de94ec4d5":
      sha_f22c9a7559a07c3c3d273d2d4633825e96224cda5ac031e44069023de94ec4d5,
    "f4c3a5a29db5da34364a4062d4f05cb32a96accb20a0aa7a78e06f8528da22bd":
      sha_f4c3a5a29db5da34364a4062d4f05cb32a96accb20a0aa7a78e06f8528da22bd,
  };
  globalThis.PYODIDE_OUTPUT = "";
  let pyodide = await loadPyodide({
    indexURL: globalThis.location,
    stdout: (msg) => globalThis.PYODIDE_OUTPUT += msg + "\n",
    stderr: (msg) => globalThis.PYODIDE_OUTPUT += msg + "\n"
  });
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install('pillow');
  await micropip.install('matplotlib');
  return pyodide;
}

async function getPyodide() {
  const pyodide = globalThis.LOADED_PYODIDE ?? await initPy();
  globalThis.LOADED_PYODIDE = pyodide;
  return globalThis.LOADED_PYODIDE;
}

async function runCode(py, code) {
  globalThis.PYODIDE_OUTPUT = "";
  try {
    if (py.FS.analyzePath("/result.png").exists) {
      py.FS.unlink("/result.png");
    }
    return await py.runPythonAsync(code);
  } catch (err) {
    globalThis.PYODIDE_OUTPUT = err.message;
  }
}

export default {
  async fetch(request, env, ctx) {
    let uri = new URL(request.url);
    console.log("Received ", uri.pathname);
    switch (uri.pathname) {
      case "/":
        return new Response(index, { headers: {
          'Content-Type': 'text/html'
        }});
      case "/eval": {
        // Implementation for the interactive portion of the pycloud site.
        const code = await request.text();
        const pyodide = await getPyodide();
        await runCode(pyodide, code);
        let b64 = "";
        if (pyodide.FS.analyzePath("/result.png").exists) {
          const file = pyodide.FS.readFile("/result.png", { encoding: "binary" });
          b64 = Buffer.from(file).toString('base64');
        }
        return new Response(JSON.stringify({
          "output": globalThis.PYODIDE_OUTPUT,
          "image": b64.length > 0 ? "data:image/png;base64," + b64 : ""
        }));
      }
      case "/test":
        // A simple example of how to run code directly. In this case using
        // Pillow to render an image and return it from the worker.
        const pyodide = await getPyodide();
        pyodide.runPython(`
          from PIL import Image
          img = Image.new(mode="RGB", size=(800, 600), color=(231, 136, 59))
          img.save("/result.png")
        `);

        let file = pyodide.FS.readFile("/result.png", { encoding: "binary" });

        return new Response(file, {
          headers: {
            'Content-Type': 'image/png'
          }
        });
      default:
        return new Response("404", {"status": 404});
    }

  },
};
