const gulp = require('gulp')
const webpack = require('webpack-stream')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')


const path = {
	dist: 'app/dist/',
	src: 'app/src/',
}

const assetsPath = {
	src: {
		html: path.src + '*.html',
		js: path.src + 'assets/js/main.js',
		jsAll: path.src + 'assets/js/**/*.*',
		scss: path.src + 'assets/scss/**/*.scss',
		api: path.src + 'api/**/*.*',
		apiDot: path.src + 'api/**/.*',
		images: path.src + 'assets/images/*.*'
	},
	dist: {
		html: path.dist + '/index.html',
		css: path.dist + 'assets/css/',
		js: path.dist + 'assets/js/',
		api: path.dist + 'api/',
		images: path.dist + 'assets/images/*.*'
	}
}

function clean(cb) {
	del([assetsPath.dist], cb())
}

gulp.task('copy-html', () => {
	return gulp.src(assetsPath.src.html)
		.pipe(gulp.dest(path.dist))
})

gulp.task('build-js', () => {
	return gulp.src(assetsPath.src.js)
		.pipe(webpack({
			mode: 'development',
			output: {
				filename: 'script.js',
			},
			watch: false,
			devtool: 'source-map',
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									['@babel/preset-env', {
										debug: true,
										corejs: 3,
										useBuiltIns: 'usage'
									}], '@babel/react'
								]
							}
						}
					}
				]
			}                  
		}))
		.pipe(gulp.dest(assetsPath.dist.js))
})

gulp.task('build-css', () => {
	return gulp.src(assetsPath.src.scss)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(assetsPath.dist.css))
})

gulp.task('build-css', () => {
	return gulp.src(assetsPath.src.scss)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(assetsPath.dist.css))
})

gulp.task('copy-api', () => {
	gulp.src(assetsPath.src.apiDot)
		.pipe(gulp.dest(assetsPath.dist.api))

	return gulp.src(assetsPath.src.api)
		.pipe(gulp.dest(assetsPath.dist.api))
})

gulp.task('copy-images', () => {
	return gulp.src(assetsPath.src.images)
		.pipe(gulp.dest(assetsPath.dist.images))
})

gulp.task('watch', () => {
	gulp.watch(assetsPath.src.html, gulp.parallel('copy-html'))
	gulp.watch(assetsPath.src.api, gulp.parallel('copy-api'))
	gulp.watch(assetsPath.src.images, gulp.parallel('copy-images'))
	gulp.watch(assetsPath.src.jsAll, gulp.parallel('build-js'))
	gulp.watch(assetsPath.src.scss, gulp.parallel('build-css'))
})

gulp.task('build', gulp.series(clean, gulp.parallel('copy-html', 'copy-api', 'copy-images', 'build-js', 'build-css')))

gulp.task('default', gulp.parallel('watch', 'build'))