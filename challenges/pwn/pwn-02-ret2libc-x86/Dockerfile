FROM alpine:3.19
RUN apk add --no-cache bash curl
WORKDIR /app
COPY src/ /app/
EXPOSE 3333
CMD ["sh", "-c", "echo Lab pwn-02-ret2libc-x86 ready && sleep infinity"]
