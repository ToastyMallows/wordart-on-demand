FROM node:12-slim

# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
RUN apt-get update \
	&& apt-get install -y wget gnupg graphicsmagick-imagemagick-compat \
	&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
	&& apt-get update \
	&& apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
		--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*


COPY ./package.json ./wordart/package.json

WORKDIR /wordart

RUN npm install

WORKDIR /

COPY ./css ./wordart/css
COPY ./js ./wordart/js
COPY ./less ./wordart/less
COPY ./lib ./wordart/lib
COPY ./index.html ./wordart/index.html
COPY ./wordartOnDemand.js ./wordart/wordartOnDemand.js

WORKDIR /wordart

ENTRYPOINT [ "node", "./wordartOnDemand.js" ]