# Facebook JS SDK
Simple npm package to interact with Facebook API. This is my first npm package so any feedback is appreciated.

## Installation
```bash
npm install facebook-js-sdk
```

## Usage
```js
const express = require("express");
const Facebook = require("facebook-js-sdk");
```

```js
const app = express();

// step 1: initialize Facebook class with config or accessToken

const facebook = new Facebook({
  appId: "123456789987654321",
  appSecret: "123456789abcdefgh987654321",
  redirectUrl: "http://localhost/callback",
  graphVersion: "v20.0",
});

// default graphVersion is v20.0 and it's optional
const facebook = new Facebook({
  graphVersion: "v20.0",
  accessToken: "access-token-here"
});

// step 2: get Facebook oauth login URL using facebook.getLoginUrl()

app.get("/login", function (req, res) {
  res.send(facebook.getLoginUrl(["email"]));
});

// step 3: oauth login redirects back to callback page and we send code GET param to facebook.callback() and fetch access_token

app.get("/callback", function (req, res) {
  if (req.query.code) {
    facebook
      .callback(req.query.code)
      .then((response) => {
        res.send(response.data.access_token); // store access_token in database for later use
      })
      .catch((error) => {
        res.send(error.response.data);
      });
  }
});

// step 4: use facebook.get() facebook.post() and facebook.delete() for GET, POST and DELETE requests

app.get("/", function (req, res) {

  // fetch access_token from database and set it using facebook.setAccessToken() for all future requests
  
  facebook.setAccessToken("user-secret-access-token");
  
  facebook
    .get("/me?fields=id,name")
    .then((response) => {
      var name = response.data.name;
      res.send(name);
    })
    .catch((error) => {
      res.send("not found");
    });
    
  facebook
    .post(
      "/page-id-here/feed",
      {
        message: "This is post message.",
      },
      "page-secert-access-token"
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error.response.data);
    });
    
  facebook
    .delete("/object-id-here")
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error.response.data);
    });
});

app.listen(3000);
```

## Testing
```bash
npm install
npm test
```

## License
MIT License

Copyright (c) 2024 Sohaib Ilyas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
