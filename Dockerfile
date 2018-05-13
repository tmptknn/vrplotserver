FROM alpine
RUN apk update
RUN apk upgrade
RUN apk add --update nodejs nodejs-npm
RUN rm -rf /var/cache/apk/*
COPY src/package.json package.json
COPY src/server.js server.js
RUN mkdir html
COPY vrplot/plotter.html html/index.html
COPY vrplot/*.js html/
RUN mkdir /html/vema
COPY vema/vema.js html/vema/
RUN mkdir /html/data
COPY vrplot/data/*.txt html/data/
RUN npm install
EXPOSE 80 3773

CMD ["npm","start"]
