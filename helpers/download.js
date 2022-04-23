const fetch = require("node-fetch");
const fs = require("fs");

function download(url, dest, cb) {
    fetch(url).then((response) => {
        var destination = fs.createWriteStream(dest);
        response.body.pipe(destination);
        destination.on("finish", function () {
            cb();
        });
    });
}

module.exports = download;