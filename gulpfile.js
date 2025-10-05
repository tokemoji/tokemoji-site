import gulp from "gulp";
import browserSync from "browser-sync";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import { deleteAsync as del } from "del";
import beautify from "gulp-beautify";
import concat from "gulp-concat";
import newer from "gulp-newer";
import touch from "gulp-touch-cmd";
import panini from "panini";
import babel from "gulp-babel";
import replace from "gulp-replace";
import plumber from "gulp-plumber";
import sourcemaps from "gulp-sourcemaps";

const { reload } = browserSync;
const sass = gulpSass(dartSass);

// Configuration
const route = {
	dist: {
		html: "dist/",
		js: "dist/assets/js/",
		css: "dist/assets/css/",
		fontStyle: "dist/assets/css/",
		img: "dist/assets/img/",
		fonts: "dist/assets/fonts/",
	},
	src: {
		html: "src/pages/**/*.html",
		partials: "src/partials/",
		script: "src/assets/js/*.*",
		jsPlugins: [
			"src/assets/js/vendor/*.*",
			"!src/assets/js/vendor/bootstrap.bundle.js",
		],
		bsScriptPath: "node_modules/bootstrap/dist/js/bootstrap.bundle.js",
		bsScriptDest: "src/assets/js/vendor/",
		bsScript: "src/assets/js/vendor/bootstrap.bundle.js",
		scss: "src/assets/scss/style.scss",
		cssPlugins: "src/assets/scss/vendor/*.*",
		bsPath: "node_modules/bootstrap/scss/**/*.*",
		bsDest: "src/assets/scss/bootstrap/scss/",
		bs: "src/assets/scss/bootstrap/*.*",
		img: "src/assets/img/**/*.{jpg,png,gif,svg,webp,mp4}",
		fonts: "src/assets/fonts/**/*.*",
		fontStyle: "src/assets/scss/fonts/*.*",
	},
	watch: {
		html: ["src/pages/**/*", "src/layouts/**/*", "src/partials/**/*"],
		scss: [
			"src/assets/scss/**/*.scss",
			"!src/assets/scss/fonts/*.scss",
			"!src/assets/scss/bootstrap/scss/**/*.scss",
		],
		cssPlugins: "src/assets/scss/vendor/*.*",
		fontStyle: "src/assets/scss/fonts/*.scss",
		script: "src/assets/js/*.*",
		jsPlugins: "src/assets/js/vendor/*.*",
		img: "src/assets/img/**/*.{jpg,png,gif,svg,webp}",
		fonts: "src/assets/fonts/**/*.*",
		bs: "src/assets/scss/bootstrap/*.*",
	},
	clean: {
		dist: "dist/*",
	},
};

// HTML task
const htmlTask = () => {
	panini.refresh();
	return gulp
		.src(route.src.html)
		.pipe(plumber())
		.pipe(newer({ dest: route.dist.html, extra: route.watch.html }))
		.pipe(
			panini({
				root: "src/pages",
				layouts: "src/layouts",
				partials: "src/partials",
				data: "src/data/",
			})
		)
		.pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
		.pipe(replace(/<(img|input|br)([^>]*?)\s*\/>/g, "<$1$2>"))
		.pipe(gulp.dest(route.dist.html))
		.pipe(touch())
		.on("end", () => reload());
};

// SCSS task
const scssTask = () => {
	return gulp
		.src(route.src.scss)
		.pipe(plumber())
		.pipe(newer(route.dist.css))
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				quietDeps: true,
				logger: dartSass.Logger.silent,
			}).on("error", sass.logError)
		)
		.pipe(autoprefixer())
		.pipe(
			beautify.css({
				indent_size: 4,
				preserve_newlines: false,
				newline_between_rules: false,
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(route.dist.css))
		.pipe(touch())
		.on("end", () => reload());
};

// CSS Plugins compilation task
const vendorCSS = () => {
	return gulp
		.src(route.src.cssPlugins)
		.pipe(plumber())
		.pipe(newer(route.dist.css))
		.pipe(gulp.dest(route.dist.css))
		.pipe(touch())
		.on("end", () => reload());
};

// Bootstrap Style Copy From node_modules
const bsStyleCopy = () => {
	return gulp.src(route.src.bsPath).pipe(gulp.dest(route.src.bsDest));
};

// Bootstrap Style compilation task
const bsStyleCompile = () => {
	return gulp
		.src(route.src.bs)
		.pipe(plumber())
		.pipe(newer(route.dist.css))
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				quietDeps: true,
				logger: dartSass.Logger.silent,
			}).on("error", sass.logError)
		)
		.pipe(autoprefixer())
		.pipe(
			beautify.css({
				indent_size: 4,
				preserve_newlines: false,
				newline_between_rules: false,
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(route.dist.css))
		.pipe(touch())
		.on("end", () => reload());
};

// Bootstrap JS Copy From node_modules
const bsScriptCopy = () => {
	return gulp.src(route.src.bsScriptPath).pipe(gulp.dest(route.src.bsScriptDest));
};

// Bootstrap JavaScript compilation task
const bsScriptCompile = () => {
	return gulp
		.src(route.src.bsScript)
		.pipe(plumber())
		.pipe(newer(route.dist.js))
		.pipe(babel({ presets: ["@babel/preset-env"] }))
		.pipe(gulp.dest(route.dist.js))
		.pipe(touch())
		.on("end", () => reload());
};

// Add this task with the other task definitions
const fontStyleTask = () => {
	return gulp
		.src(route.src.fontStyle)
		.pipe(plumber())
		.pipe(newer(route.dist.fontStyle))
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				quietDeps: true,
				logger: dartSass.Logger.silent,
			}).on("error", sass.logError)
		)
		.pipe(autoprefixer())
		.pipe(
			beautify.css({
				indent_size: 4,
				preserve_newlines: false,
				newline_between_rules: false,
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(route.dist.fontStyle))
		.pipe(touch())
		.on("end", () => reload());
};

// JavaScript task
const jsTask = () => {
	return gulp
		.src(route.src.script)
		.pipe(plumber())
		.pipe(newer(route.dist.js))
		.pipe(babel({ presets: ["@babel/preset-env"] }))
		.pipe(concat("app.js"))
		.pipe(gulp.dest(route.dist.js))
		.pipe(touch())
		.on("end", () => reload());
};

// JavaScript vendor compilation task
const vendorScript = () => {
	return gulp
		.src(route.src.jsPlugins)
		.pipe(plumber())
		.pipe(newer(route.dist.js))
		.pipe(gulp.dest(route.dist.js))
		.pipe(touch())
		.on("end", () => reload());
};

// Image optimization
const imageTask = () => {
	return gulp
		.src(route.src.img, { allowEmpty: true })
		.pipe(plumber())
		.pipe(newer(route.dist.img))
		.pipe(gulp.dest(route.dist.img))
		.pipe(touch())
		.on("end", () => reload());
};

// Transfer Fonts
const fontsTask = () => {
	return gulp
		.src(route.src.fonts)
		.pipe(newer(route.dist.fonts))
		.pipe(gulp.dest(route.dist.fonts))
		.pipe(touch());
};

// Clean task
const cleanTask = () => del(route.clean.dist);

// Server setup
const serverTask = (done) => {
	browserSync.init({
		server: { baseDir: "./dist" },
		ghostMode: false,
		notify: false,
	});
	done();
};

// watch task
const watchTask = () => {
	gulp.watch(route.watch.html, htmlTask);
	gulp.watch(route.watch.scss, scssTask);
	gulp.watch(route.watch.cssPlugins, vendorCSS);
	gulp.watch(route.watch.bs, bsStyleCopy);
	gulp.watch(route.watch.fontStyle, fontStyleTask);
	gulp.watch(route.watch.script, jsTask);
	gulp.watch(route.watch.jsPlugins, vendorScript);
	gulp.watch(route.watch.img, imageTask);
	gulp.watch(route.watch.fonts, fontsTask);
	gulp.watch(route.src.bsScript, bsScriptCompile);
};

// Update build task to include new tasks
const buildTask = gulp.series(
	cleanTask,
	gulp.series(
		bsStyleCopy,
		bsScriptCopy,
		gulp.parallel(
			htmlTask,
			scssTask,
			vendorCSS,
			fontStyleTask,
			bsStyleCompile,
			jsTask,
			vendorScript,
			imageTask,
			fontsTask,
			bsScriptCompile
		)
	)
);

// Default task
const defaultTask = gulp.series(buildTask, gulp.parallel(serverTask, watchTask));

// Export all tasks
export {
	htmlTask as html,
	scssTask as scss,
	imageTask as images,
	jsTask as scripts,
	cleanTask as clean,
	serverTask as serve,
	watchTask as watch,
	vendorCSS,
	bsStyleCopy,
	bsStyleCompile,
	bsScriptCopy,
	bsScriptCompile,
	vendorScript,
	fontsTask,
	fontStyleTask,
	buildTask as build,
	defaultTask as default,
};
