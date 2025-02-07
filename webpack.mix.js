const mix = require('laravel-mix');

mix.ts('resources/js/App.tsx', 'public/js/app.js')
   .react()
   .sass(`resources/sass/app.scss`, 'public/css/app.css')
   .setPublicPath('public')
   .version()