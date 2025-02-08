module.exports = {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/**/*.blade.php',
    './resources/**/*.{js,jsx,ts,tsx,vue,css,scss}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '430px',
      },
      scale: {
        '115': '1.15',
      },
    }
  },
  plugins: [],
};
