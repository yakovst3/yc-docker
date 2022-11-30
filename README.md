# yc-docker

### to build

```sh
docker build . -t dovid-moshe-crow/yc-docker
```

### to run

```sh
docker run -p 4321:4321 -d --name <the name you choose>  dovid-moshe-crow/yc-docker
```

#### open ports
- 4321

#### static folders
- `/files/whatsapp`
- `/files/upload`

#### upload files to: POST `/upload` using `Multipart/form-data` with key `file`