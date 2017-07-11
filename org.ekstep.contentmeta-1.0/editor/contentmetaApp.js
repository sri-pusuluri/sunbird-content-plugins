angular.module('contentmetaApp', []).controller('contentmetaController', ['$scope', function($scope) {
    $scope.mode = org.ekstep.collectioneditor.api.getService('collection').getConfig().mode;
    $scope.metadataCloneOb = {};
    $scope.nodeId = $scope.nodeType = '';
    ecEditor.getService('meta').getConfigOrdinals(function(err, resp) {
        if (!err) {
            $scope.gradeList = resp.data.result.ordinals.gradeLevel;
            $scope.languageList = resp.data.result.ordinals.language;
            $scope.audienceList = resp.data.result.ordinals.audience;
            //TODO: Replace below list with API resplonse
            $scope.boardList = {};
            $scope.boardList["CBSE"]  = "CBSE";
            $scope.boardList["NCERT"] = "NCERT";
            $scope.boardList["ICSE"] = "ICSE"
            $scope.boardList["MSCERT"] = "MSCERT";
            $scope.boardList["Other"] = "Othres";
          
            $scope.subjectList = {};
            $scope.subjectList["Maths"]  = "Maths";
            $scope.subjectList["English"] = "English";
            $scope.subjectList["Hindi"] = "Hindi"
            $scope.subjectList["Bengali"] = "Bengali";
            $scope.subjectList["Telugu"] = "Telugu";
            $scope.subjectList["Tamil"] = "Tamil";
            $scope.subjectList["Kannada"] = "Kanada";
            $scope.subjectList["Marathi"] = "Marathi";
            $scope.$safeApply();
        }
    });
    
    ecEditor.dispatchEvent('org.ekstep.conceptselector:init', {
        element: 'contentConceptSelector',
        selectedConcepts: [], // All composite keys except mediaType
        callback: function(data) {
            $scope.content.concepts = '(' + data.length + ') concepts selected';
            // $scope.concepts = _.map(data, function(concept) {
            //     return concept.id;
            // });
            $scope.$safeApply();
        }
    });


    $scope.showAssestBrowser = function(){
        ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
            type: 'image',
            search_filter: {}, // All composite keys except mediaType
            callback: function(data) { 
                $scope.content.appIcon = data.assetMedia.src;
                $scope.$safeApply();
            }
        });
    }
    
    $scope.updateNode = function(){
        if($scope.contentMetaForm.$valid){ 
            if(_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) {
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId] = {};
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["isNew"] = $scope.newNode;
                org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId]["root"] = false;
            }
            if(_.isString($scope.content.tags)){
                $scope.content.tags = $scope.content.tags.split(',');
            }
            $scope.content.contentType = $scope.nodeType;
            org.ekstep.collectioneditor.api.getService('collection').setNodeTitle($scope.content.name);
            org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata = _.assign(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata , $scope.getUpdatedMetadata($scope.metadataCloneObj, $scope.content));;
            $scope.metadataCloneObj = _.clone($scope.content);
            $scope.$safeApply();
        }else{
            $scope.submitted = true; 
        }
    }

    $scope.getUpdatedMetadata = function(originalMetadata, currentMetadata){
        var metadata = { };
        if(_.isEmpty(originalMetadata)){
            _.forEach(currentMetadata, function(value, key){
                metadata[key] = value;
            });
        }else{
            _.forEach(currentMetadata   , function(value, key){
                if(_.isUndefined(originalMetadata[key])){
                    metadata[key] = value;
                }else if(value != originalMetadata[key]){
                    metadata[key] = value;
                }
            });
        }
        return metadata;
    }

    $scope.addlesson = function(){
        ecEditor.dispatchEvent("org.ekstep.lessonbrowser:show");
    }

    $scope.onNodeSelect = function(evant, data){
        var contentArr = ["Story", "Collection", "Game", "Worksheet"];
        $scope.editable = org.ekstep.collectioneditor.api.getService('collection').getObjectType(data.data.objectType).editable;
        if(_.indexOf(contentArr, data.data.objectType) != -1){
            $scope.nodeId = data.data.id;
            $scope.nodeType = data.data.objectType;
            $scope.content = {};
            $scope.editMode = $scope.newNode = false;
            $scope.editable = org.ekstep.collectioneditor.api.getService('collection').getObjectType(data.data.objectType).editable;
            $scope.defaultImage = ecEditor.resolvePluginResource("org.ekstep.contentmeta", "1.0", "assets/default.png");
            
            var activeNode = org.ekstep.collectioneditor.api.getService('collection').getActiveNode();
            if($scope.mode === "Edit" && $scope.editable === true){
                $scope.editMode = true;
                $('.ui.dropdown').dropdown('refresh');
                $scope.metadataCloneObj = _.clone($scope.content);
            }
            if(!_.isEmpty(activeNode.data.metadata)){
                $scope.editMode = false;
                $scope.content = (_.isUndefined(org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId])) ? activeNode.data.metadata : _.assign(activeNode.data.metadata, org.ekstep.collectioneditor.cache.nodesModified[$scope.nodeId].metadata);
                $scope.metadataCloneObj = _.clone(activeNode.data.metadata);
                if(!_.isUndefined(activeNode.data.metadata.concepts)){
                    $scope.content.concepts = activeNode.data.metadata.concepts;
                    $scope.content.conceptData = '(' + $scope.content.concepts.length + ') concepts selected';
                }
            }else{
                $scope.newNode = true;
            }
            $scope.getPath();
            $scope.$safeApply();
        }
    }
    ecEditor.addEventListener('org.ekstep.collectioneditor:node:selected', $scope.onNodeSelect);

    $scope.getPath = function() {
        $scope.path = [];
        var path = ecEditor.jQuery("#collection-tree").fancytree("getTree").getActiveNode().getKeyPath();
        _.forEach(path.split('/'), function(key) {
            if(key){
                var node = ecEditor.jQuery("#collection-tree").fancytree("getTree").getNodeByKey(key);
                $scope.path.push({'title' : node.title, 'nodeId'  : node.key })
            }
        });
    }

    $scope.setActiveNode = function(nodeId){
        org.ekstep.collectioneditor.api.getService('collection').setActiveNode(nodeId);
    }

    $scope.previewContent = function(){
        ecEditor.setContext('contentId', $scope.nodeId);
        org.ekstep.services.contentService.getContent($scope.nodeId, function(err, content) {
            if (!err) {
                var contentBody = content.body;
                org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: content.body, 'currentStage': false });
                console.log('contentBody ',contentBody);
            } else {
              ecEditor.getService('popup').open({
                template: '<div class="ui icon negative message success-popup"><div class="content"><div class="header">Unable to preview the content, please try again later</div></div></div>',
                controller: ['$scope', function(){}],
                closeByDocument: true,
                closeByEscape: true, 
                clasName: "ngdialog-theme-plain",               
                plain: true,
                showClose: false
              });
              org.ekstep.services.telemetryService.error({ "env": "content", "stage": "", "action": "show error", "err": "Unable to fetch content from remote", "type": "API", "data": err, "severity": "fatal" });
            }
        });
    }

    $scope.generateTelemetry = function(data) {
        if (data) org.ekstep.services.telemetryService.interact({ "type": data.type, "subtype": data.subtype, "target": data.target, "pluginid": "org.ekstep.contentmeta", "pluginver": "1.0", "objectid": $scope.nodeId, "stage": $scope.nodeId })
    }
}]);
//# sourceURL=contentmetaApp.js