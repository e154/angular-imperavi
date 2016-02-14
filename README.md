# Angular Imperavi Redactor directive

Created for [e154](http://e154.ru)

Note that Imperavi Redactor itself is a proprietary commercial copyrighted software but since Yii community bought OEM license you can use it for free with Yii.

### Install

```javascript
bower install e154/angular-imperavi
```
    
### Init

```javascript
app = angular.module('app', [
            'ui.imperavi'
        ]
    )
```
    
### Using

```javascript
vm.editor_plugins = ['table', 'video', 'fullscreen', 'clips', 'counter', 'filemanager', 'imagemanager', 'textexpander', 'fontsize', 'textdirection'];
vm.editor_options = {
            autoload_plugins: true
            imageUpload: "/api/admin/post/"+vm.paramId+"/attach/image",
            imageManagerJson: "/api/admin/post/"+vm.paramId+"/attach/list"
            };
vm.model = {
    content_filtered: ""
};

<textarea asset-path="/admin/static/private/imperavi/"
          lang="ru" 
          plugins="post.editor_plugins"
          id="redactor"
          name="redactor"
          ui-imperavi
          ng-model="post.model.content_filtered"
          options="post.editor_options">
</textarea>
```

### Minimal

```javascript
$scope.content_filtered: ""

<textarea ui-imperavi ng-model="content_filtered"></textarea>
```
 
### Deps
    
Asset directory must be visible from the Internet. 
To be able to dynamically load plugins and language pack
Set it:
    
```javascript
asset-path="/admin/static/private/imperavi/"
```
    
