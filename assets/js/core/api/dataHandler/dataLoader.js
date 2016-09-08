/* global $*/

var doctual = window.doctual || {};
doctual.dataLoader = function () {
    var _data;
    function _getDataLayer() {
        var _dataLayer = window.dataLayer = window.dataLayer || [];
        return _dataLayer;
    }
    
    function pushToDataLayer(data) {
        if (!data) {
            console.error("No data to push to the datalayer");
            return;
        }
        var dataLayer = _getDataLayer();
        dataLayer.push(data);
        window.dataLayer = dataLayer;
        
    }
    function getContracts (url, cb) {
        var xhr = $.getJSON(url);
        xhr.done(function (response) {
           cb(response);
        });
    }
    
    return {
        getContracts: getContracts,
        pushToDataLayer: pushToDataLayer
    }
}

