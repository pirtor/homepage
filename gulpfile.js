const { src, dest, watch, series } = require("gulp");
const del = require("del");
const connect = require("gulp-connect");

const htmlmin = require("gulp-htmlmin");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
sass.compiler = require("node-sass");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

const config = {
  output: "dist",
  html: "src/index.html",
  scss: "src/scss/*.scss",
  js: "src/js/*.js",
}

// 处理scss
function scssTask() {
  return src(config.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(dest(config.output))
    .pipe(connect.reload());
}

// 打包js
function jsTask() {
  return src(config.js)
    .pipe(concat("build.js"))
    .pipe(uglify())
    .pipe(dest(config.output))
    .pipe(connect.reload());
}

// 压缩 html
function htmlTask() {
  return src(config.html)
    .pipe(htmlmin())
    .pipe(dest(config.output))
    .pipe(connect.reload());
}


// 清空 output/
function cleanTask() {
  return del(config.output);
}

// 启动本地服务
function startServer() {
  // 监听文件变化
  watch(config.html, htmlTask);
  watch(config.scss, scssTask);
  watch(config.js, jsTask);

  return connect.server({
    root: config.output,
    port: 4399,
    livereload: true,
  })
}

const build = series(cleanTask, htmlTask, scssTask, jsTask);

exports.build = build;
exports.dev = series(build, startServer);
