## Running

```
npm start
```

Local mode works. Preview service exceeds CPU.

## Running python repl using wasmtime

wasmtime .\bin\python.wasm --mapdir lib::lib

## Fun things

- Module not found _pyodide
  - Turned out to be because my loadBinary was returning an ArrayBuffer.
  - This confused Module.FS.write and cause it to silently not extract the
    tarball properly.
  - I worked this out by running Pyodide in the browser and checking differences
  - In browser loadBinary returned a Uint8Array, changing to this fixed it.