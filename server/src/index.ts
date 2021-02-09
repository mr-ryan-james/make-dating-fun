import express from "express";
import https from "https";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { exec } from "child_process";
import bodyParser from "body-parser";
const app = express();
const port = 3001;

app.use(cors());

app.use(
  "/graphql",
  createProxyMiddleware({
    target: "https://www.okcupid.com/graphql",
    changeOrigin: true,
    onProxyReq: (proxyReq, _req, _res) => {
      proxyReq.setHeader(
        "cookie",
        "__cfduid=d200b3799a445999e5485663545a3bf421608773504; secure_check=1; ab.storage.deviceId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54=%7B%22g%22%3A%225c4501b2-8cfa-81b1-ca87-d4347d25f676%22%2C%22c%22%3A1608773507630%2C%22l%22%3A1608773507630%7D; __ssid=69b005adaa654e3255cf748f633e0a0; OptanonAlertBoxClosed=2020-12-24T01:31:54.035Z; _ga=GA1.2.361689962.1608773514; _fbp=fb.1.1608773517949.1172963623; override_session=0; ab.storage.userId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54=%7B%22g%22%3A%2210861555661426865863%22%2C%22c%22%3A1608773548995%2C%22l%22%3A1608773548995%7D; secure_login=1; authlink=99edd42ca5a29970; session=10861555661426865863%3a16525528440724475059; siftsession=6118278785392094775; _gid=GA1.2.2031427343.1609770603; OptanonConsent=isIABGlobal=false&datestamp=Mon+Jan+04+2021+10%3A02%3A18+GMT-0500+(Eastern+Standard+Time)&version=6.6.0&hosts=&consentId=20233959-5d34-45ef-b4b3-2d8afa61238c&interactionCount=1&landingPath=NotLandingPage&groups=1%3A1%2C2%3A1%2C3%3A1%2C4%3A1&geolocation=US%3B&AwaitingReconsent=false; ab.storage.sessionId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54=%7B%22g%22%3A%2204160814-19e1-ead9-8901-81299f69e21f%22%2C%22e%22%3A1609774338321%2C%22c%22%3A1609770604200%2C%22l%22%3A1609772538321%7D; nano=k%3Diframe_prefix_lock_1%2Ce%3D1609772608365%2Cv%3D1"
      );
    },
  })
);

app.post("/api/open", bodyParser.json(), (req, res) => {
  req.body.ids.forEach((id: string) => {
    exec(
      `/Applications/Firefox.app/Contents/MacOS/firefox -new-tab https://www.okcupid.com/profile/${id}`
    );
  });
  res.send({ status: "SUCCESS" });
});

app.post("/api/icebreaker", bodyParser.json(), (req, res) => {
  const data = JSON.stringify(req.body);

  const options = {
    hostname: "www.okcupid.com",
    port: 443,
    path: "/1/apitun/messages/send",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      "x-okcupid-locale": "en",
      "x-okcupid-platform": "DESKTOP",
      cookie:
        'secure_check=1; ab.storage.deviceId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54={"g":"5c4501b2-8cfa-81b1-ca87-d4347d25f676","c":1608773507630,"l":1608773507630}; __ssid=69b005adaa654e3255cf748f633e0a0; OptanonAlertBoxClosed=2020-12-24T01:31:54.035Z; _ga=GA1.2.361689962.1608773514; _fbp=fb.1.1608773517949.1172963623; override_session=0; ab.storage.userId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54={"g":"10861555661426865863","c":1608773548995,"l":1608773548995}; secure_login=1; authlink=99edd42ca5a29970; session=10861555661426865863:16525528440724475059; __cfduid=dc74f773a9a904746f0188f037d61cf3c1611798675; _gid=GA1.2.2123169973.1612011181; siftsession=1499628704613521032; OptanonConsent=isIABGlobal=false&datestamp=Sat+Feb+06+2021+08:27:50+GMT-0500+(Eastern+Standard+Time)&version=6.6.0&hosts=&consentId=20233959-5d34-45ef-b4b3-2d8afa61238c&interactionCount=1&landingPath=NotLandingPage&groups=1:1,2:1,3:1,4:1&geolocation=US;&AwaitingReconsent=false; ab.storage.sessionId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54={"g":"0441bfd1-d691-6c56-f55b-d24fd82a03f7","e":1612619871746,"c":1612618070839,"l":1612618071746}; amp_f90f10=iEd70A6Bh8zff6uLcviEMI.MTA4NjE1NTU2NjE0MjY4NjU4NjM=..1etrodv0c.1etrpmjtv.1ng.0.1ng; nano=k=iframe_prefix_lock_1,e=1612619536822,v=1|k=iframe_prefix_lock_2,e=1612619606796,v=1',
    },
  };
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
