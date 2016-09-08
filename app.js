var lunr = require("lunr");
var data = require("./data");
var jsonfile = require("jsonfile");

console.log(data);

var contracts = {};
var searchIndex = lunr(function () {
    this.field('title', {boost: 10});
    this.field("body");
    this.ref("id");
});


for(var i=0; i<data.contracts.length; i++) {
    var item = data.contracts[i];
    var contract_index = {
        'title': item.name,
        'body': item.link,
        'id': item.id
    };
    contracts[item.id] = item;
    searchIndex.add(contract_index);
}

var path = 'index_data.json';

jsonfile.writeFile(path, JSON.stringify({
        index: searchIndex.toJSON(),
        contracts: contracts
    }), function (err) {
    console.error(err);
});
