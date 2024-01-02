let fs = require("fs");
let http = require("http");
http.createServer((req, res) => {
    try {
        if (req.url.endsWith(".js")) {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
        }
        res.end(fs.readFileSync("." + req.url).toString());
    } catch(err) {
        res.end("404");
    }
}).listen(8080);
