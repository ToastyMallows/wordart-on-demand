FROM node:12-slim

RUN echo "deb http://us-west-2.ec2.archive.ubuntu.com/ubuntu/ trusty multiverse \
	deb http://us-west-2.ec2.archive.ubuntu.com/ubuntu/ trusty-updates multiverse \
	deb http://us-west-2.ec2.archive.ubuntu.com/ubuntu/ trusty-backports main restricted universe multiverse" | tee /etc/apt/sources.list.d/multiverse.list

# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
RUN apt-get update \
	&& apt-get install -y --allow-unauthenticated wget gnupg graphicsmagick-imagemagick-compat ttf-mscorefonts-installer \
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


COPY ./css /wordart/css
COPY ./css/fonts /wordart/css/fonts
COPY ./js /wordart/js
COPY ./less /wordart/less
COPY ./lib /wordart/lib
COPY ./index.html /wordart/index.html
COPY ./wordartOnDemand.js /wordart/wordartOnDemand.js

WORKDIR /wordart

ENTRYPOINT [ "node", "./wordartOnDemand.js" ]