/*global module, require*/

module.exports = function(grunt) {
	// URI paths for our tasks to use.
	grunt.uri = './';
	grunt.uriStatic = grunt.uri + 'web/';
	grunt.uriDist = grunt.uriStatic + 'dist/';
	grunt.uriSrc = grunt.uriStatic + 'src/';
	grunt.uriTask = grunt.uri + 'script/grunt/';

	// Our task object where we'll store our configuration.
	var tasks = {};
	tasks.concat = {};
	tasks.pkg = grunt.file.readJSON('package.json')

	// Lint Tasks
	tasks = require(grunt.uriTask + 'css-lint.js')(grunt, tasks);
	tasks = require(grunt.uriTask + 'html-lint.js')(grunt, tasks);
	tasks = require(grunt.uriTask + 'js-lint.js')(grunt, tasks);

	// Concatenation Tasks
	tasks = require(grunt.uriTask + 'css-concat.js')(grunt, tasks);
	tasks = require(grunt.uriTask + 'js-concat.js')(grunt, tasks);

	// Minify Tasks
	tasks = require(grunt.uriTask + 'css-minify.js')(grunt, tasks);
	tasks = require(grunt.uriTask + 'html-minify.js')(grunt, tasks);
	tasks = require(grunt.uriTask + 'js-minify.js')(grunt, tasks);
	tasks = require(grunt.uriTask + 'start-server.js')(grunt,tasks);
	tasks = require(grunt.uriTask + 'html-build.js')(grunt,tasks);

	grunt.loadNpmTasks('grunt-contrib-watch');

	// config watch, rebuild html file if changed
	tasks.watch = {
		index: {
			files: [grunt.uriSrc+'/index.tpl.html'],
			tasks: ['htmlbuild:dev','prettify:dev'],
			options: {
      	event: ['changed'] //all | deleted | changed | added
      },
    },
  }

  grunt.loadNpmTasks('grunt-prettify')
  tasks.prettify = {
  	dev : {
  		options :{
  			"indent": 2,
  			"indent_char": " ",
  			"indent_scripts": "normal",
  			"wrap_line_length": 0,
  			"brace_style": "collapse",
  			"preserve_newlines": true,
  			"max_preserve_newlines": 1,
  			"unformatted": [
  			"a",
  			"code",
  			"pre"
  			]
  		},
  		html : {files: {}}
  	}
	}

  tasks.prettify.dev.html.files[ grunt.uriStatic+'index.html'] = [grunt.uriStatic+'index.html'];

	// Register The Tasks
	grunt.registerTask('lint', ['csslint', 'htmllint', 'jshint']);
	grunt.registerTask('minify', ['cssmin', 'htmlmin', 'uglify']);
	grunt.registerTask('default', ['lint', 'concat', 'minify']);
	grunt.registerTask('start-server',['connect']);
	grunt.registerTask('start-dev',['htmlbuild:dev','prettify:dev','start-server','watch:index']);

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

	// Initialize The Grunt Configuration
	grunt.initConfig(tasks);
};
