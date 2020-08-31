# XIBO API

Node module to consume the Xibo CMS API

## Installation

```js
npm add usignxibo
```

## Usage

On your Xibo CMS server, navigate to the Application page and click the 'Add Application' button to get the Client ID and Client Secret needed to authenticate in the API

With this information you can start consuming the api making the first connection to the server:

```ts
const xibo = new Xibo({
  url,
  client_id: conn.client_id,
  client_secret: conn.client_secret,
  grant_type: "client_credentials",
});
if (await xibo.authenticate()) {
  return xibo;
}
```
