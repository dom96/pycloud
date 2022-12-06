This repo holds a proof of concept fork of Pyodide which implements support for
Cloudflare Workers. The implementation right now is somewhat hacky but it does
function and allows you to use libraries like Pillow and matplotlib on Workers.

To play around with it visit https://pycloud.picheta.me, or clone this repo
and follow the "Running" section below.

I wouldn't recommend using this in production as it stands right now. For an
alternative way to use Python on Workers (which is more official) check out
[this template](https://github.com/cloudflare/python-worker-hello-world).
## Running

> :warning: You need a Workers Paid plan in order to run this on your account,
> otherwise you may see "CPU exceeded" errors. You'll also need `wrangler`.

```
$ git clone https://github.com/dom96/pycloud
$ cd pycloud/pycloud
$ npm start
```

## Code Samples

Below are some code samples that are known to run well inside this implementation.
### Pillow

```python
from PIL import Image
img = Image.new(mode="RGB", size=(800, 600), color=(231, 136, 59))
img.save("/result.png")
```

### Matplotlib

This does work, but the WASM files are too big to be uploaded to prod.

```python
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('Agg')
fig, ax = plt.subplots( nrows=1, ncols=1 )  # create figure & 1 axis
ax.plot([0,1,2], [10,20,3])
fig.savefig('/result.png')   # save the figure to file
plt.close(fig)    # close the figure window
```

## Caveats

* This effectively runs a CPython interpreter that has been compiled to WASM on
Workers. This means performance isn't great, especially for cold starts.
* The changes made to Pyodide have been applied on top of a minimised version of
the Pyodide v0.21.3's JS files (which have been prettified). Ideally in the
future it would be nice to apply the same changes to Pyodide's repo and upstream them.
* Because Cloudflare Workers only allows execution of WebAssembly that has been
pre-bundled with the worker, every Python package which includes wasm modules
needs to be manually pre-compiled and included in the worker JS file.
There is also some logic which has been disabled inside Pyodide that appears to
optimise JS by compiling it partially to WASM, this is likely to cause poor performance.
* The cold starts are really bad because CPython is reinitialised each time,
including each of the packages (which are fetched over the internet). This can
take around 10 seconds.
