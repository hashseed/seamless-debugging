= Seamless debugging =

== Preparations ==

Start server:
```bash
node --inspect index.js
```

Note: you might need to free up the port
```bash
fuser -k 8080/tcp
```

== Demo instructions ==

* Point Chrome to the server at `localhost:8080`
* Open DevTools (A).
* Click on the Node.js icon to open a second DevTools (B) instance.
* Reload the page.
* Set a break point on the first line of `CaseRequest`.
* Click on a button to send request.
* Step in DevTools (A) until the fetch request.
* Observe switch to DevTools (B).
* Step a bit in server code.
* Continue execution.
* Observe switch back to DevTools (A).
* Step a bit more.
