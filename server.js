var configFilePath = "config.json";
var http = require("http");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync(configFilePath));
var host = config.host;
var port = config.port;
var express = require("express");
var file=require("chunkfilereader");

var app = express();


app.get("/", function (request, response) {
    response.send("Hello");
});
app.get("/data/:bytesRead/chunk/:chunksize", function (request, response) {

    var seek = parseInt(request.params.bytesRead);
    var pagesize = parseInt(request.params.chunksize);
    file.readChunk(config.logfile, seek, pagesize, function (err, seekcount, buffer) {
        if (buffer) {
            response.send(buffer);
        }
        else { response.send(-1); }
        
    });
});

function resultContainer(isSuccess) {

    var result = {
        success: function (data) {
            return {
                isSuccess: true,
                data: data
            }
        },
        error: function (data) {
            return {
                isSuccess: false,
                data: data
            }
        }
    }
    return result;
}



app.use(express.static((config.dirname || ".") + "/public"));

app.listen(port, host);

var fs = require("fs");
console.log("Server running at pot: " + port);
console.log("Go to URL http://localhost:" + port + "/index.html for demo purpose");
Console.log("You can go to config.json to specify log_file");
var bytesRead = 0;

