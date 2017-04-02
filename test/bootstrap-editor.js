var testContext = {
	uid: 'unittest',
	sid: 'testsession',
	contentId: 'do_1234'
}

var testConfig = {
	dispatcher: 'console',
	pluginRepo: 'http://localhost:9876/base',
	corePluginsPackaged: false,
	plugins: {
		'org.ekstep.stage': '1.0',
		'org.ekstep.config': '1.0'
	}
}

var $scope = {
	$safeApply: function(cb) { cb()},
	$watch: function() {},
	refreshToolbar: function() {}
}

var $document = {
	on: function() {}
}

ContentEditorTestFramework = {
	initialized: false,
	cleanUp: function() {
		org.ekstep.contenteditor.stageManager.stages = [];
	},
	init: function(cb, plugins) {
		ContentEditorTestFramework.cleanUp();
		
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		console.log('####### Initializing Content Editor Framework #######');
		if(plugins) testConfig.plugins = plugins;
		org.ekstep.contenteditor.init(testContext, testConfig, $scope, $document, function() {
			if(!ContentEditorTestFramework.initialized) {
				org.ekstep.contenteditor.stageManager.registerEvents();
				ContentEditorTestFramework.initialized = true;
			}
			console.log('####### Content Editor Framework Initialized #######');
			cb();
		});
	},
	getFabricObject: function(objectId, canvas) {
		return ecEditor._.find(canvas.getObjects(), {id: objectId});
	},
	objectsEqual: function(editorObj, fabricObj) {
		expect(editorObj).toBe(fabricObj);
	},
	validateObject: function(object, map) {
		ecEditor._.forIn(map, function(value, key) {
			expect(ecEditor._.get(object, key)).toBe(value);
		});
	},
	resize: function(objectId, scaleX, scaleY) {
		var object = ecEditor._.find(ecEditor.getCanvas().getObjects(), {id: objectId});
		object.set({scaleX: scaleX, scaleY: scaleY});
		ecEditor.getCanvas().fire('object:modified', {target: object});
		object.fire('modified', {});
	},
	moveTo: function(objectId, x, y) {
		var object = ecEditor._.find(ecEditor.getCanvas().getObjects(), {id: objectId});
		object.set({left: x, top: y});
		ecEditor.getCanvas().fire('object:modified', {target: object});
		object.fire('modified', {});
	},
	rotate: function(objectId, angle) {
		var object = ecEditor._.find(ecEditor.getCanvas().getObjects(), {id: objectId});
		object.set({angle: angle});
		ecEditor.getCanvas().fire('object:modified', {target: object});
		object.fire('modified', {});
	},
	resizing: function(objectId, scaleX, scaleY) {
		var object = ecEditor._.find(ecEditor.getCanvas().getObjects(), {id: objectId});
		ecEditor.getCanvas().fire('object:scaling', {target: object});
		object.fire('resizing', {});
	},
	moving: function(objectId, x, y) {

	},
	rotating: function(objectId, angle) {

	},
	select: function(objectId) {
		var object = ecEditor._.find(ecEditor.getCanvas().getObjects(), {id: objectId});
		ecEditor.getCanvas().setActiveObject(object);
		//ecEditor.getCanvas().fire('object:selected', {target: object});
		object.fire('selected', {});
	},
	unselect: function(objectId) {
		var object = ecEditor._.find(ecEditor.getCanvas().getObjects(), {id: objectId});
		ecEditor.getCanvas().discardActiveObject({});
		//EkstepEditorAPI.getCanvas().fire('selection:cleared', {target: object});
		object.fire('deselected', {});
	}
}
