FROM node:9

RUN mkdir -p /code/zenjirasync
COPY src /code/zenjirasync
WORKDIR /code/zenjirasync/
ENTRYPOINT ["./entrypoint.sh"]