/**
 * Created by delta54 on 31.05.15.
 */

(function(){
    'use strict';

    var debug = true;

    var log = function(m){
        if (debug){
            console.log("imeravi: "+m);
        }
    };

    angular
        .module('ui.imperavi', [])
        .directive('uiImperavi', ['$timeout', '$window', function($timeout, $window){
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    assetPath: "@",
                    lang: "@",
                    plugins: "=",
                    options: "="
                },
                link: function($scope, element, attrs, ngModel ) {

                    log("init");

                    $window.loaded_plugins = [];
                    var isLoaded = false;
                    // set options
                    var options = $.extend(true, {
                        buttonSource: true,
                        focus: true,
                        linebreaks: false
                    }, $scope.options);
                    options.plugins = $scope.plugins;
                    options.changeCallback = function(value){
                        $timeout(function() {
                            $scope.$apply(function() {
                                ngModel.$setViewValue(value);
                            });
                        })
                    };

                    var getLang = function(callback){

                        if($scope.assetPath == 'undefined' || typeof $scope.lang == 'undefined') {
                            callback();
                            return;
                        }

                        var file = $scope.assetPath + "lang/" + $scope.lang + ".js";
                        log("load lang file: "+file);
                        $.getScript(file, function(data, textStatus, jqxhr) {
                            if(jqxhr.status == 200){
                                options.lang = $scope.lang;
                            }
                            callback();
                        });
                    };

                    var getPlugins = function(callback){

                        var plugins = [
                            {
                                id: 'clips',
                                css: 'clips.css',
                                js: 'clips.js'
                            },
                            {
                                id: 'counter',
                                js: 'counter.js'
                            },
                            {
                                id: 'definedlinks',
                                js: 'definedlinks.js'
                            },
                            {
                                id: 'filemanager',
                                js: 'filemanager.js'
                            },
                            {
                                id: 'fontcolor',
                                js: 'fontcolor.js'
                            },
                            {
                                id: 'fontsize',
                                js: 'fontsize.js'
                            },
                            {
                                id: 'fullscreen',
                                js: 'fullscreen.js'
                            },
                            {
                                id: 'fontfamily',
                                js: 'fontfamily.js'
                            },
                            {
                                id: 'imagemanager',
                                js: 'imagemanager.js'
                            },
                            {
                                id: 'limiter',
                                js: 'limiter.js'
                            },
                            {
                                id: 'textdirection',
                                js: 'textdirection.js'
                            },
                            {
                                id: 'textexpander',
                                js: 'textexpander.js'
                            },
                            {
                                id: 'video',
                                js: 'video.js'
                            },
                             {
                                id: 'table',
                                js: 'table.js'
                            }
                        ];
                        var callback_count = 0;

                        angular.forEach($scope.plugins, function(plugin, key){
                            for(var i=0;i<plugins.length;i++){
                                if(plugins[i].id == plugin){

                                    // check if plugin loaded
                                    //if($window.loaded_plugins.indexOf(plugins[i].id) != -1) {
                                    //    ++callback_count;
                                    //    if(callback_count == $scope.plugins.length){
                                    //        callback();
                                    //    }
                                    //
                                    //    log("plugin "+plugins[i].id+" exist");
                                    //    continue;
                                    //}

                                    $window.loaded_plugins.push(plugins[i].id);

                                    // load css file
                                    if(typeof plugins[i].css != 'undefined') {
                                        var file = $scope.assetPath + "plugins/" + plugins[i].id + "/" + plugins[i].css;
                                        log("load css file: "+file);
                                        $("<link/>", {
                                            rel: "stylesheet",
                                            type: "text/css",
                                            href: file
                                        }).appendTo("head");
                                    }

                                    // load js file
                                    if(typeof plugins[i].js != 'undefined') {

                                        var file = $scope.assetPath + "plugins/" + plugins[i].id + "/" + plugins[i].js;
                                        log("load plugin: "+file);
                                        $.getScript(file, function(data, textStatus, jqxhr) {
                                            ++callback_count;
                                            if(callback_count == $scope.plugins.length){
                                                callback();
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    };

                    var start = function(){

                        // start redactor
                        var callback = function(){

                            if(!isLoaded) {
                                log("start");

                                $(element)
                                    .redactor(options)
                                    .redactor('insert.set', ngModel.$viewValue || '');

                                isLoaded = true;
                            }
                        };
                        getLang(function(){
                            getPlugins(function(){
                                callback();
                            })
                        });
                    };

                    var destroy = function(){
                        $(element).redactor('core.destroy');
                        log("destroy");
                    };

                    var restart = function(){
                        destroy();
                        start();
                    };

                    $scope.$watch('lang', 'plugins', 'options', function(value){
                        restart();
                    });

                    // Editor unloaded
                    $scope.$on('$destroy', function (event, next, current) {
                        destroy();
                    });

                    ngModel.$render = function() {
                        $timeout(function() {
                            if (isLoaded) {
                                $(element)
                                    .redactor('insert.set', ngModel.$viewValue || '')
                                    .redactor('placeholder.toggle');
                            }
                        });
                    };

                    start();
                }
            }
        }]);
}());