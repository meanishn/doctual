var jsonFile = require("jsonfile");
var doctualSheet = require("./googleSheet/doctualSheet");

var obj = {
        'contracts': []
    };

doctualSheet.getData(function (row) {
   for (var i=0; i<row.length; i++) {
       var curr_row = row[i];
       if (!curr_row[0] && !curr_row[1] && !curr_row[2] && !curr_row[3] && !curr_row[5]) {
           console.log("Invalid");
           continue;
       }
       obj.contracts.push({
           id: curr_row[0],
           name: curr_row[1] || "",
           category: curr_row[2] || "",
           sub_category: curr_row[3] || "",
           link: curr_row[5] || ""
       });
   }
   jsonFile.writeFile("demo.json", obj);
   console.log("writing to file succeeded.........");
});