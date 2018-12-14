/**
 * 异步路由控制
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
!(function(window, document) {
    /**
     * 兼容性检测
     * @type {Object}
     */
    var support = {
        classList: document.classList && document.classList.contains,
        pushState: window.history.pushState
    };

    /**
     * 路由控制器
     * @param {[type]} options [description]
     */
    function Router(options) {
        return new Router.prototype.init(options);
    }

    window.router = {
        config: Router
    };

    Router.prototype = {
        constructor: Router,

        /**
         * 初始化
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        init: function(options) {
            this.currentUrl = '';
            this.baseURI = options.baseURI || '';
            this.historyType = options.history || 'hash';

            // 不支持history API
            if (this.historyType === 'history' && !support.pushState) {
                this.historyType = 'hash';
                console.warn('Your browser doesn\'t support history API, fallback by using hashchange event.');
            }

            if (this.historyType === 'history') {
                for (var i in options.routes) {
                    if (options.routes.hasOwnProperty(i)) {
                        options.routes[this.baseURI + i] = options.routes[i];
                        options.routes[i] = undefined;
                    }
                }
            }

            this.routes = $.extend(true, {}, {
                '/': this.noop
            }, options.routes || {});

            this.bindEvents();

            return this;
        },

        /**
         * 相关事件绑定
         * @return {[type]} [description]
         */
        bindEvents: function() {
            document.addEventListener('click', function(e) {
                if (this.hasClass(e.target, 'router-link')) {
                    e.preventDefault();

                    if (this.historyType === 'hash') {
                        location.hash = '#' + e.target.getAttribute('to');
                    } else {
                        var state = {
                            data: {},
                            title: document.title,
                            url: this.baseURI + e.target.getAttribute('to')
                        };

                        this.routes[state.url] && this.routes[state.url]();
                        window.history.pushState(state, state.title, state.url);
                    }
                }
            }.bind(this), false);

            window.addEventListener('load', this.refresh.bind(this), false);
            window.addEventListener('hashchange', this.refresh.bind(this), false);

            window.addEventListener('popstate', function(e) {
                var state = window.history.state;
                console.log('state', state);

                if (!state) {
                    return;
                }

                this.routes[state.url] && this.routes[state.url]();
                window.history.replaceState(state, state.title, state.url);
            }.bind(this), false);
        },

        /**
         * 空函数
         * @return {[type]} [description]
         */
        noop: function() {},

        /**
         * 判断元素是否存在指定class
         * @param  {[type]}  elem [description]
         * @param  {[type]}  cls  [description]
         * @return {Boolean}      [description]
         */
        hasClass: function(elem, cls) {
            if (!elem || (elem.nodeType !== 1 && elem.nodeType !== 9)) {
                return;
            }

            if (support.classList) {
                return elem.classList.contains(cls);
            }

            var classes = elem.getAttribute('class') || '';

            return classes.split(' ').indexOf(cls) !== -1;
        },

        /**
         * 添加一条路由
         * @param  {[type]}   path     [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        route: function(path, callback) {
            if (this.historyType === 'hash') {
                this.routes[path] = callback || this.noop;
                return this;
            }

            var state = {
                data: {},
                title: document.title,
                url: this.baseURI + path
            };

            this.routes[state.url] = callback || this.noop;

            window.history.pushState(state, state.title, state.url);

            return this;
        },

        /**
         * 路由处理
         * @return {[type]} [description]
         */
        refresh: function() {
            this.currentUrl = location.hash.slice(1) || '/';
            this.routes[this.currentUrl]();

            return this;
        }
    };

    Router.prototype.init.prototype = Router.prototype;

})(window, document);
