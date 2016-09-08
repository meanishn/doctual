(function () {
    var dataLayer = window.dataLayer = window.dataLayer || [];
     /* function to push to the dataLayer
     * @param [type] String [document category name]
     * @param [obj] Object [object holding data for the respective document]
     */
    function pushToDataLayer(type, arr) {
        if (!type) {
            throw new Error("document type is required");
        }
        var obj = dataLayer[0] || {};
        obj[type] = arr;
        dataLayer[0] = obj;
    }
    /**
     * function to add multiple document to single category of document
     */ 
    function addDocument(type, data) {
        pushToDataLayer(type, data);
    }
    
    function _formatData(type, allData) {
        var output = [];
        var _temp = {};
        if (!type) {
            throw new Error("type is required to format data")
        }
        switch(type) {
            case 'category':
                for (var i=0; i<allData.length; i++) {
                    var item = allData[i];
                    _temp[item.type] = {
                        id: item.id,
                        name: item.name,
                        link: item.link
                    };
                    output.push(_temp);
                }
                break;
        }
        
        return output;
    }
    
    addDocument("Foundation", [
        {
            name: "Employment Contract",
            link: "/link/to/contract/page"
        },
        {
            name: "Random contract",
            link: "/link/to/random/contract"
        },
        {
            name: "Lagbhag doc",
            link: "/lik"
        }
    
    ]);
    
    addDocument("Operation", [
        {
            name: "foo",
            link: "bar"
        }
            
    ]);
    
}());