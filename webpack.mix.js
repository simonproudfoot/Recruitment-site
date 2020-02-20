const laravelMix = require('laravel-mix');

laravelMix
    .setPublicPath('../../../site/themes/mifjobs/')
    .setResourceRoot('../')
    .js('js/app.js', 'js/mifjobs.js')
    .sass('scss/style.scss', 'css/mifjobs.css')
