var gulp 		= require('gulp');
//var install 	= require('gulp-install');
//var util 		= require('gulp-util');
var watch 		= require('gulp-watch');
var sass 		= require('gulp-sass');
var notify		= require('gulp-notify');

// paths
const sass_src 	= 'assets/scss/**/*.scss';
const sass_dest = 'assets/css';

gulp.task('sass', async function(){

	return gulp.src(sass_src)
	.pipe(sass({
		outputStyle:'expanded'
	}))
	.on('error', notify.onError(
	{
		title: 'Error Compiling SASS',
		message: '<%= error.message %>'
	}))
	.pipe(gulp.dest(sass_dest))
	.pipe(notify({
		title: "Compiled <%= file.relative %>",
		message: "<%= options.date %>",
		templateOptions: {
			date: new Date()
		}
	}));

	//done();

    //.pipe(livereload());

});

gulp.task('watch', function(){

	//gulp.watch([sass_src], ['sass']);
	return gulp.watch([sass_src], gulp.series('sass'));

});

gulp.task('default', gulp.parallel('sass', 'watch'));
