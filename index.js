'use strict';

const http = require('http');
const inspector = require('inspector');

const html =
`
<body>
<textarea rows="2" cols="40" id="input">
Convert me to upper case!
</textarea>
<br/>
<button type="button" onclick="CaseRequest('upper')">to upper case</button>
<button type="button" onclick="CaseRequest('lower')">to lower case</button>
</body>

<script>
async function CaseRequest(case_mode) {
  let text = document.getElementById("input").value;
  let request = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({ text, case_mode }),
    };
  let response = await fetch('http://localhost:8080', request);
  let result = await response.json();
  document.getElementById("input").value = result;
}
</script>

<style>
#input {
  resize: none;
}
body {
  margin:0;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
`

function ProcessInput(request) {
  let {text, case_mode} = JSON.parse(request);
  switch (case_mode) {
    case "upper":
      text = text.toUpperCase();
      break;
    case "lower":
      text = text.toLowerCase();
      break;
  }
  return JSON.stringify(text);
}

async function GetPostBody(request) {
  return new Promise(function(resolve) {
    let body = "";
    request.on('data', data => body += data);
    request.on('end', end => resolve(body));
  });
}

async function Server(request, response) {
  try {
    if (request.method == 'POST') {
      if (request.headers["devtools"]) {
        console.log("DevTools is performing: " + request.headers["devtools"]);
      }
      let body = await GetPostBody(request);
      let result = ProcessInput(body);
      response.writeHead(200, {
        'Content-Type': 'application/json'
      });
      response.write(result);
      response.end();
    } else {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.write(html);
      response.end();
    }
  } catch (e) {
    console.log(e);
  }
}

// fuser -k 8080/tcp
http.createServer(Server).listen(8080);
