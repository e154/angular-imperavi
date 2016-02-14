###*
# Created by delta54 on 31.05.15.
###

'use strict'
debug = false

log = (m) ->
  if debug
    console.log 'imeravi: ' + m

angular
.module('ui.imperavi', [])
.directive 'uiImperavi', ['$timeout','$window'
  ($timeout, $window) ->
    {
      restrict: 'A'
      require: 'ngModel'
      scope:
        assetPath: '@'
        lang: '@'
        plugins: '='
        options: '='
      link: ($scope, element, attrs, ngModel) ->
        log 'init'
        $window.loaded_plugins = []
        isLoaded = false

        # set options
        options = $.extend(true,
          buttonSource: true
          focus: true
          linebreaks: false
          autoload_plugins: false
          plugins: $scope.plugins if $scope.plugins
        , $scope.options || {})

        options.changeCallback = (value) ->
          $timeout ->
            $scope.$apply ->
              ngModel.$setViewValue value

        getLang = (callback) ->
          if typeof $scope.assetPath == 'undefined' || typeof $scope.lang == 'undefined'
            callback()

          file = $scope.assetPath + 'lang/' + $scope.lang + '.js'
          log 'load lang file: ' + file
          $.getScript file, (data, textStatus, jqxhr) ->
            if jqxhr.status == 200
              options.lang = $scope.lang
            callback()

        getPlugins = (callback) ->
          if typeof $scope.assetPath == 'undefined'
            callback()

          plugins = [
            {id: 'clips',css: 'clips.css',js: 'clips.js'}
            {id: 'counter',js: 'counter.js'}
            {id: 'definedlinks',js: 'definedlinks.js'}
            {id: 'filemanager',js: 'filemanager.js'}
            {id: 'fontcolor',js: 'fontcolor.js'}
            {id: 'fontsize',js: 'fontsize.js'}
            {id: 'fullscreen',js: 'fullscreen.js'}
            {id: 'fontfamily',js: 'fontfamily.js'}
            {id: 'imagemanager',js: 'imagemanager.js'}
            {id: 'limiter',js: 'limiter.js'}
            {id: 'textdirection',js: 'textdirection.js'}
            {id: 'textexpander',js: 'textexpander.js'}
            {id: 'video',js: 'video.js'}
            {id: 'table',js: 'table.js'}
          ]
          callback_count = 0
          angular.forEach $scope.plugins, (plugin) ->
            i = 0
            while i < plugins.length
              if plugins[i].id == plugin
                #TODO need check if plugin is loaded
                $window.loaded_plugins.push plugins[i].id

                # load css file
                if plugins[i]?.css
                  file = $scope.assetPath + 'plugins/' + plugins[i].id + '/' + plugins[i].css
                  log 'load css file: ' + file
                  $('<link/>',
                    rel: 'stylesheet'
                    type: 'text/css'
                    href: file).appendTo 'head'

                # load js file
                if plugins[i]?.js
                  file = $scope.assetPath + 'plugins/' + plugins[i].id + '/' + plugins[i].js
                  log 'load plugin: ' + file
                  $.getScript file, (data, textStatus, jqxhr) ->
                    ++callback_count
                    if callback_count == $scope.plugins.length
                      callback()
              i++

        start = ->

          # start redactor
          callback = ->
            if !isLoaded
              log 'start'
              $(element).redactor(options).redactor 'insert.set', ngModel.$viewValue or ''
              isLoaded = true

          if options.autoload_plugins
            getLang ->
              getPlugins ->
                callback()
          else
            callback()

        destroy = ->
          $(element).redactor 'core.destroy'
          log 'destroy'

        restart = ->
          destroy()
          start()

        $scope.$watch 'lang', 'plugins', 'options', (val, old_val) ->
          if val == old_val
            return

          restart()

        # Editor unloaded
        $scope.$on '$destroy', (event, next, current) ->
          destroy()

        ngModel.$render = ->
          $timeout ->
            if isLoaded
              $(element).redactor('insert.set', ngModel.$viewValue or '').redactor 'placeholder.toggle'

        #
        # init
        #------------------------------
        start()
    }
]
