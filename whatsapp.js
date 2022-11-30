const qrcode = require("qrcode-terminal");
const request = require("request");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
var mime = require("mime-types");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("message", async (message) => {
  console.log("message");

  let fname = null;

  if (message.hasMedia) {
    const media = await message.downloadMedia();
    fname = `${message.id.id}.${mime.extension(media.mimetype)}`;
    fs.writeFileSync(
      `${process.cwd()}/files/whatsapp/${fname}`,
      media.data,
      "base64",
      () => console.log("file saved")
    );
  }

  const params = {
    id: (await message.getContact()).number,
    type: message.type,
    body: message.body,
    fname,
  };

  request.get(
    `<webhook address goes here>?${new URLSearchParams(
      params
    )}`,
    {},
    (err, res, body) => {
      console.log(body);
    }
  );
});

// server
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();
const port = 4321;

app.use("/recived-media", express.static(process.cwd() + "/files/whatsapp"));
app.use("/uploaded-media", express.static(process.cwd() + "/files/upload"));

app.use(fileUpload());

app.post("/message", async (req, res) => {
  try {
    let media = null;
    if (req.query.fname) {
      const data = fs.readFileSync(`${process.cwd()}/files/upload/${req.query.fname}`, {
        encoding: "base64",
      });
      media = new MessageMedia(
        mime.lookup(req.query.fname),
        data,
        req.query.fname
      );
    }
    await client.sendMessage(req.query.id + "@c.us", req.query.body, { media });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/upload", async (req, res) => {
  console.log("uploading");
  console.log(`${process.cwd()}/files/upload/${req.files.file.name}`);
  fs.writeFileSync(
    `${process.cwd()}/files/upload/${req.files.file.name}`,
    req.files.file.data,
    "base64",
    () => console.log("file uploaded")
  );

  res.json({ success: true });
});

app.listen(port, () => console.log(`listening on port ${port}`));
