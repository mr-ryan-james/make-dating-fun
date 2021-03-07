import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import Dashboard from "./Dashboard";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
  cache: new InMemoryCache(),
  headers: {
    cookie:
      "__cfduid=d200b3799a445999e5485663545a3bf421608773504; secure_check=1; ab.storage.deviceId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54=%7B%22g%22%3A%225c4501b2-8cfa-81b1-ca87-d4347d25f676%22%2C%22c%22%3A1608773507630%2C%22l%22%3A1608773507630%7D; __ssid=69b005adaa654e3255cf748f633e0a0; OptanonAlertBoxClosed=2020-12-24T01:31:54.035Z; _ga=GA1.2.361689962.1608773514; _fbp=fb.1.1608773517949.1172963623; override_session=0; ab.storage.userId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54=%7B%22g%22%3A%2210861555661426865863%22%2C%22c%22%3A1608773548995%2C%22l%22%3A1608773548995%7D; secure_login=1; authlink=99edd42ca5a29970; session=10861555661426865863%3a16525528440724475059; siftsession=6118278785392094775; _gid=GA1.2.2031427343.1609770603; OptanonConsent=isIABGlobal=false&datestamp=Mon+Jan+04+2021+10%3A02%3A18+GMT-0500+(Eastern+Standard+Time)&version=6.6.0&hosts=&consentId=20233959-5d34-45ef-b4b3-2d8afa61238c&interactionCount=1&landingPath=NotLandingPage&groups=1%3A1%2C2%3A1%2C3%3A1%2C4%3A1&geolocation=US%3B&AwaitingReconsent=false; ab.storage.sessionId.719f8d59-40d7-4abf-b9c3-fa4bf5b7cf54=%7B%22g%22%3A%2204160814-19e1-ead9-8901-81299f69e21f%22%2C%22e%22%3A1609774338321%2C%22c%22%3A1609770604200%2C%22l%22%3A1609772538321%7D; nano=k%3Diframe_prefix_lock_1%2Ce%3D1609772608365%2Cv%3D1",
  },
});



function App() {


  return (
    <ApolloProvider client={client}>
      <Dashboard />
    </ApolloProvider>
  );
}

export default App;
