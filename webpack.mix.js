const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/result.js', 'public/js')
    .js('resources/js/validate.js', 'public/js')
    .js('resources/js/butterfly_counts.js', 'public/js')
    .js('resources/js/inat.js', 'public/js')
    .js('resources/js/inat_pull.js', 'public/js')
    .js('resources/js/count_clean.js', 'public/js')
    .js('resources/js/boi_fix_taxa.js', 'public/js')
    .vue()
    .css('resources/css/style.css', 'public/css')
    .sass('resources/sass/app.scss', 'public/css');
