(function() {
	var path = require('path'),
	    fs = require('fs');

	/*
	 State.
	 */
	var config,
	    cli,
	    logger,
	    projectDir,
	    resourcesDir,
	    platformDir,
	    filesDir,
	    afs,
	    filename = "LaunchScreen.storyboard",
	    pluginDir = path.join(__dirname, '..');

	/*
	 Config.
	 */

	exports.init = function(_logger, _config, _cli, appc) {
		config = _config;
		cli = _cli;
		logger = _logger;
		afs = appc.fs;

		projectDir = path.join(cli.argv['project-dir'], 'Resources');
		platformDir = path.join(cli.argv['project-dir'], 'platform', 'iphone');
							
		logger.info(__('Looking for ' + filename));

		if(!afs.exists(path.join(platformDir, filename))) {
			logger.warn(__('No ' + filename + ' found, skipping ...'));
			return;
		}

		var buildDir = path.join(projectDir, '..', 'build');
		resourcesDir = path.join(buildDir, 'platform');
		if (!afs.exists(buildDir)) {
			fs.mkdirSync(buildDir);
		}
		if (!afs.exists(resourcesDir)) {
			fs.mkdirSync(resourcesDir);
		}

		// set the resources directory
		cli.argv['platform-dir'] = resourcesDir;

		cli.addHook('build.ios.xcodeproject', {
			pre : function(build, finished) {
				var xobjs = build.args[0].hash.project.objects;

				linkStoryboard(xobjs);
				finished();
			}
		});
	};

	/*
	Hooks.
	*/

	/**
	 * Links the storyboard placed in /platform/ios to the native resources.
	 */
	function linkStoryboard(xobjs) {

		var xcodeIdPrefix = '13370000000000000000000';
		var xcodeId = 0;
		var PBXBuildFile = xobjs.PBXBuildFile;
		var PBXFileReference = xobjs.PBXFileReference;
		var PBXResourcesBuildPhase = xobjs.PBXResourcesBuildPhase;
		var PBXGroup = xobjs.PBXGroup;
		var x1 = xcodeIdPrefix + (xcodeId++);
		var x2 = xcodeIdPrefix + (xcodeId++);
		var x3 = xcodeIdPrefix + (xcodeId++);

		logger.info(__('Linking ' + filename));

		PBXBuildFile[x1] = {
			isa : 'PBXBuildFile',
			fileRef : x2
		};
		PBXBuildFile[x1 + '_comment'] = filename + ' in Resources';
		PBXFileReference[x2] = {
			isa : 'PBXFileReference',
			fileEncoding : 4,
			lastKnownFileType : 'file.storyboard',
			name : filename,
			path : '"' + path.join(platformDir, filename) + '"',
			sourceTree : '"<absolute>"'
		};
		PBXFileReference[x2 + '_comment'] = filename;

		var group = xobjs.PBXGroup['29B97317FDCFA39411CA2CEA'];

		PBXResourcesBuildPhase['838159D01B7A9632002EE811'].files.push({
			value : x1,
			comment : filename + ' in Resources'
		});
		PBXGroup[x3] = {
			isa : 'PBXGroup',
			children : [{
				value : x2,
				comment : filename
			}],
			name : 'LaunchScreen',
			sourceTree : '"<group>"'
		};
		PBXGroup[x3 + '_comment'] = 'LaunchScreen';
		PBXGroup['29B97317FDCFA39411CA2CEA'].children.push({
			value : x3,
			comment : 'LaunchScreen'
		});
	}

})();
