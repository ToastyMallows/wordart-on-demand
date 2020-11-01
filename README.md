# ![Wordart On Demand](./img/header.png "Wordart On Demand")

A node script and docker container for generating transparent PNGs of 90s MS Wordart.

Built on [css3wordart](https://github.com/arizzitano/css3wordart) written by [Ari Rizzitano](https://github.com/arizzitano).  Inspired by [pythonWordArt](https://github.com/zorbaproject/pythonWordArt) written by [zorbaproject](https://github.com/zorbaproject).  Also inspired by [https://makewordart.com going offline](https://twitter.com/mikemcchillin/status/1319111139838496768).  I figured it's time for everyone to generate their own Wordart locally 🙂\
&nbsp;

## ![How It Works](./img/how-it-works.png "How It Works")

The node script parses command line arguments and uses regex to replace text in a template HTML file that will render the wordart when loaded in a browser.  [Puppeteer](https://github.com/puppeteer/puppeteer) is used to load a headless version of Google Chrome and take a screenshot of the page with a transparent background.  That screenshot is then trimmed by [GraphicsMagick](https://github.com/aheckmann/gm) and saved to an output directory.\
&nbsp;

## ![Usage Info](./img/usage-info.png "Usage Info")

### Using Node

To Wordart PNGs using nodejs:

1. Install [nodejs and npm](https://nodejs.org/)
1. Clone the repo
1. `npm install`
1. `npm test` to see all design examples
1. `node .\wordartOnDemand.js -w "Hello World" -a rainbow` to generate a specific wordart

See usage with `--help` (`-h`) to see all supported styles.

### Using Docker

If you don't want to install Node/NPM (or you like Docker better), you can generate Wordart PNGs using Docker.  Note that this Docker image will take up ~1 GB, since it needs to download Chromium to render the image in a browser.

#### Docker Hub Image

You can utilize the prebuilt Docker image that is hosted on Docker Hub:

> <https://hub.docker.com/repository/docker/toastymallows/wordart-on-demand>

```shell
docker run --rm -v ~/wordart/out:/wordart/out toastymallows/wordart-on-demand:latest -w "Hello World" -a rainbow
```

Your generated PNG should be located at `/home/<user>/wordart/out` (`\\wsl$\<WSL 2 OS>\home\<wsl2 user>\wordart\out` on Windows via WSL 2.)

#### Build Docker Image manually

If you'd prefer, you can build the Docker image manually.

##### Windows

1. Install [Docker](https://www.docker.com/products/docker-desktop)
1. Install and setup [WSL 2](https://docs.docker.com/docker-for-windows/wsl/)
1. Install a [WSL 2 Linux OS in Windows](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (I chose Ubuntu 20.04.1 LTS)
1. Open the WSL 2 command prompt
1. `cd /mnt/<repo clone directory>`
1. `docker build -t wordart .`
1. `docker run --rm -v ~/wordart/out:/wordart/out wordart:latest -w "Hello World" -a rainbow`
1. Your generated PNG should be located at `\\wsl$\<WSL 2 OS>\home\<wsl2 user>\wordart\out` (accessible from Windows Explorer)

##### Linux

1. Install [Docker](https://www.docker.com/products/docker-desktop)
1. `docker build -t wordart .`
1. `docker run --rm -v ~/wordart/out:/wordart/out wordart:latest -w "Hello World" -a rainbow`
1. Your generated PNG should be located at `/home/<user>/wordart/out`

##### Mac

Try it out and let me know!  PRs welcome 🙂\
&nbsp;

## ![TODO](./img/todo.png "TODO")

- Allow changing output directory via command line argument (when running from Node)
- Allow making Wordart larger via command line argument
