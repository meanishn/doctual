/* global navigator, lunr */
(function ($) {
    var doctual = window.doctual = window.doctual || {};
    
    doctual.Model = function () {
        this.data = {
            modalTemplate: [
                '<ol class="doclist">{{#docs}}',
                '<li class="doc-list-item">',
                '<a href="{{link}}"><div class="doc-name">{{name}}</div></a>',
                '</li>',
                '{{/docs}}</ol>'
            ]
        };
    };
    
    doctual.Model.prototype = {
        get: function (key) {
            return this.data[key];
        },
        set: function (key, value) {
            this.data[key] = value;
        },
        getContractsData: function (url, cb) {
            var self = this;
            $.getJSON(url)
            .done(function (response) {
               self.data["contractsData"] = JSON.parse(response);
               self.formatAutoCompleteData();
               
               cb(self.data);
            });
        },
        formatAutoCompleteData: function () {
            /**
             * format the data in following format:
             * data = [ {
                 value: "foo bar foo",
                 data: {
                     id: "123",
                     type: "blah",
                     link: "/blah/blah"
                 }
             }]
             *
             */
             
             var self = this;
            function _format(contractsData) {
                var transformed = [];
                var cdata = contractsData.contracts;
                for(var key in cdata) {
                    if (cdata.hasOwnProperty(key)) {
                        var obj = cdata[key];
                        var name = obj.name;
                        
                        delete obj.name;
                        transformed.push({
                            value: name,
                            data: obj
                        });    
                    }
                    
                }
                
                return transformed;
            }
            var clonedData = $.extend(true, {}, this.data.contractsData);
            this.set("autoCompleteData", _format(clonedData));
        }

    };
    
    var multiStepForm = function () {
        var current_fs, next_fs;
        
        function _bindEvent() {
            function _handler (e) {
                e.preventDefault();
                
                if (e.type === "keyup") {
                    if (e.keyCode !== 13) {
                        return false;
                    }
                }
                current_fs = $(this).parents("fieldset");
                next_fs = current_fs.next();
                current_fs.hide();
                next_fs.show();
                next_fs.find(".first-input").focus();
            }
            // $(".signup-form").on("keyup", ".first-input", _handler);
            $(".first-input").keyup(_handler)
            .keydown(function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                }
            });
            $(".next-btn").on("click", _handler);
        }
        
        return {
            init: function () {
                _bindEvent();
            }
        };
    };
        
    $().ready(function() {
        var model = new doctual.Model();
        multiStepForm().init();
        model.getContractsData("/index_data.json", function (allData){
            search(allData);
            modalHandler.render(model);
        });
        
    });

    $(window).on('scroll', function() {
        var responsive = $(window).width();
        if (responsive >= 768) {
            parallax();
        }
    });
    
    var parallax = debounce(function() {
        $('.parallax').each(function() {
            var $elem = $(this);

            if (isElementInViewport($elem)) {
                var parent_top = $elem.offset().top;
                var window_bottom = $(window).scrollTop();
                var $image = $elem.find('.parallax-background-image');
                var $oVal = ((window_bottom - parent_top) / 3);
                $image.css('margin-top', $oVal + 'px');
            }
        });
    }, 6);

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }


    function isElementInViewport(elem) {
        var $elem = $(elem);

        // Get the scroll position of the page.
        var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
        var viewportTop = $(scrollElem).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        // Get the position of the element on the page.
        var elemTop = Math.round($elem.offset().top);
        var elemBottom = elemTop + $elem.height();

        return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
    }
    
    /*********************** Handle Modal content *****************************/
    var modalHandler = (function () {
        var currentModalData;
        
        function _formatByTypes (data) {
            var _formatted = [];
            var _temp = {};
            var arr = [];
            
            for(var key in data) {
                if (data.hasOwnProperty(key)) {
                    var type = data[key].type;
                    delete data[key].type;
                    
                    _temp[type] = _temp[type] || [];
                    _temp[type].push(data[key]);
                }
                
            }
            return _temp;
        }
        
        function handleModalContent(modalType, $el, template) {
            
            var html = Mustache.to_html(template.join(""), {
                docs: currentModalData[modalType]
            });
            $el.html(html);
        }
    
        function handleModalTitle(modalType, $el) {
            $el.text(modalType);
        }
    
        function clickHandler(obj) {
            $(".doc-type-item").on("click", function () {
                var type = $(this).attr("data-doctype");
                var $el = $("#docModal .doc-list");
                handleModalContent(type, $el, obj.template);
                handleModalTitle(type, $("#docModal .modal-title"));
            });
        }
        
        function render(model) {
            currentModalData = _formatByTypes(model.get("contractsData").contracts);
            clickHandler({
                template: model.get("modalTemplate")
            });
        }
        
        return {
            render: render
        };
    }());
    
    /******************** Doctual search Functionality **********************/
    
    
    function search(data) {
        function _handleSearchResult(refs, _data) {
            var searchedData = []
            for(var i=0; i<refs.length; i++) {
                var index = refs[i];
                searchedData.push(_data[index.ref]);
            }
            return searchedData;
        }
    
        function _renderSearchResult($parentEl, _data) {
            var $position = $parentEl.find(".doc-list");
            var html = Mustache.to_html(data.modalTemplate.join(""), {
                docs: _data
            });
            $parentEl.find(".modal-title").text("Search Result");
            if (!_data.length) {
                $position.html("<strong>No search results. </strong>");
                return;
            }
            
            $position.html(html);
        }
        
        $("#search").devbridgeAutocomplete({
            lookup: data.autoCompleteData,
            onSelect: function (suggestion) {
                console.log("Selected: "+ suggestion.value + "data: ", suggestion.data);
        
            }
        });
        
        var index = lunr.Index.load(data.contractsData.index);
        $("#search-box-form").on("submit", function (e) {
                e.preventDefault();
                console.log("pressed enter");
                var query = $(this).find("#search").val();
                var result = index.search(query);
                var finaldata = _handleSearchResult(result, data.contractsData.contracts);
                _renderSearchResult($("#docModal"), finaldata);
                $("#docModal").modal();
                
        });
        
    }
    
}(window.jQuery));
