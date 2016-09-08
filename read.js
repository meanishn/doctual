// var events = require("eventEmitter");
var jsonFile = require("jsonfile");
var lineReader = require("readline").createInterface({
    input: require('fs').createReadStream('contracts.txt')
});
var current_type = "";
var obj = {
        'contracts': []
    };
var count = 0;

lineReader.on("line", function (line) {
    if (!line) {
        return;
    }
    if (/^\d+/.test(line[0])) {
        current_type = line.replace(/^\d+./, "");
        return;
    }
    count++;
    obj.contracts.push({
        id: count,
        name: line,
        type: current_type
    });
});

lineReader.on("close", function () {
    console.log(obj);
    jsonFile.writeFile("demo.json", obj);
});
