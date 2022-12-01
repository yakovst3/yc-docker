# yc-docker

### to build

```sh
docker build . -t dovid-moshe-crow/yc-docker
```

### to run

```sh
 docker run --env WEBHOOK=<webhook address goes here> -p 4321:4321 -d -v <local path>:/usr/src/app/files --name <the name you choose>  dovid-moshe-crow/yc-docker
 mkdir <local path>/upload
 mkdir <local path>/whatsapp
```

#### open ports
- 4321

#### static folders
- `/files/whatsapp`
- `/files/upload`

#### upload files to: POST `/upload` using `Multipart/form-data` with key `file` , the file is saved in `/files/upload`
#### upload files to: POST `/upload-whatsapp` using `Multipart/form-data` with key `file` , , the file is saved in `/files/whatsapp`