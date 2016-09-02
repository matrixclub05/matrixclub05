!function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition();
    else if (typeof define == 'function') define(definition);
    else this[name] = definition();
}('sticky', function () {

    function getStickyStyle(top) {
        var el = document.createElement('div'),
            mStyle = el.style,
            top = top || 0;
        mStyle.cssText = 'position:' + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join('sticky;position:') + 'sticky;';
        if (mStyle.position.indexOf('sticky') == -1) {
            return false;
        } else {
            return 'position: ' + mStyle.position + '; top: ' + top + 'px;';
        }
    }

    return function sticky(bars, requiredTop) {
        var len = bars.length;
        if (!getStickyStyle()) {
            var winScrollY = window.scrollY,
                requiredTop = requiredTop || 0,
                top,
                data = [];

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame =
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };

            }

            function onScroll() {
                winScrollY = window.scrollY;
                requestAnimationFrame(update);
            }

            function init(bars) {
                var i = 0,
                    len = bars.length;
                document.addEventListener('scroll', onScroll, false);

                for (i = 0; i < len; i++) {
                    top = bars[i].getBoundingClientRect().top;
                    data.push({
                        origTop: top + winScrollY,
                        fixed: false
                    });
                    bars[i].classList.add('fixed');
                }
                update();
            }

            function processHeader(data, header) {
                var pos = (data.origTop - winScrollY);
                if (pos > requiredTop) {
                    data.fixed = false;
                    header.style.transform = 'translate3d(-50%, ' + pos + 'px, 0px)';
                }
                if (!data.fixed && pos <= requiredTop) {
                    data.fixed = true;
                    header.style.transform = 'translate3d(-50%, ' + requiredTop + 'px, 0px)';
                }
            }

            function update() {
                var i = 0;
                for (i; i < len; i++) {
                    processHeader(data[i], bars[i]);
                }
            }

            init(bars);

        } else {
            for (var i = 0; i < len; i++) {
                var originStyle = bars[i].getAttribute('style') || '';
                bars[i].setAttribute('style', originStyle + getStickyStyle(requiredTop));
            }
        }

    }
});

sticky(document.querySelectorAll('.bar'), 20);