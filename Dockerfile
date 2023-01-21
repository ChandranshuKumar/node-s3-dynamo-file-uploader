FROM --platform=linux/amd64 node:17
ENV APP_HOME /first-node-app
WORKDIR $APP_HOME
COPY . $APP_HOME/
RUN npm ci
RUN npm run build
EXPOSE 8080
CMD ["node", "build"]