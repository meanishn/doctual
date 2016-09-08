doctual.ui = (function ($) {
    function _eventListener() {
        $('.selector').click(function() {
            SelectColor(this);
        });
        
        $(window).on('scroll', function() {
            var responsive = $(window).width();
            if (responsive >= 768) {
                parallax();
            }
        });
        
        $(".doc-type-item").on("click", function () {
            var type = $(this).attr("data-doctype");
            var $el = $("#docModal .doc-list");
            
            var html = Mustache.to_html(template.join(""), {
                docs: currentModalData
            });
            
            modal.setContent("docModal", {
                title: type,
                content: html
            });
            // handleModalContent(type, $el);
            // handleModalTitle(type, $("#docModal .modal-title"));
        });
    }
    
    var modal = {
        _modals: {},
        registerModal: function (name, options) {
            var _valid = true;
            var requiredAttr = ['titleSelector', 'contentSelector'];
            if (typeof options !== "object") {
                return;
            }
            var keys = Object.keys(options);
            
            for (var i=0; i<requiredAttr.length; i++) {
                if (keys.indexOf(requiredAttr[i]) === -1) {
                    _valid = false;
                    break;
                }
            }
            if (!name) {
                throw new Error("name not defined");
            }
            if (_valid) {
                this._modals = options;
            }
            
        },
        
        setContent: function (name, obj) {
            if (!obj) {
                obj = {};
            }
            var modal = this._modals[name];
            var $el = $(modal.element);
            $el.find(modal.titleSelector).html(obj.title || modal.title);
            $el.find(modal.contentSelector).html(obj.content || modal.content);
        }
    }
    function handleModalContent(modalType, $el) {
        var data = window.dataLayer[0];
        var currentModalData = data[modalType];
        
        // var template = [
        //         '<ol class="doclist">{{#docs}}',
        //         '<li class="doc-list-item">',
        //         '<a href="{{link}}"><div class="doc-name">{{name}}</div></a>',
        //         '</li>',
        //         '{{/docs}}</ol>'
        //     ];
        var html = Mustache.to_html(template.join(""), {
            docs: currentModalData
        });
        $el.html(html);
    }
    
    function handleModalTitle(modalType, $el) {
        $el.text(modalType);
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

    function SelectColor(btn) {
        var oldColor = $('.filter-gradient').attr('data-color');
        var newColor = $(btn).attr('data-color');

        var oldButton = $('a[id^="Demo"]').attr('data-button');
        var newButton = $(btn).attr('data-button');

        $('.filter-gradient').removeClass(oldColor).addClass(newColor).attr('data-color', newColor);

        $('a[id^="Demo"]').removeClass("btn-" + oldButton).addClass("btn-" + newButton).attr('data-button', newButton);

        $('.carousel-indicators').removeClass("carousel-indicators-" + oldColor).addClass("carousel-indicators-" + newColor);

        $('.card').removeClass("card-" + oldColor).addClass("card-" + newColor);

        $('.selector').removeClass('active');
        $(btn).addClass('active');
    }
    
    function init() {
        $().ready(function () {
            _eventListener();
            modal.registerModal("docModal", {
                element: "#docModal",
                titleSelector: ".modal-title",
                contentSelector: ".modal-content"
            })
        })
    }
}(window.jQuery));