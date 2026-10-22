module.exports = {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
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
      keyframes: {
        blink: {
          '0%, 100%': {opacity: '1'},
          '50%': {opacity: '0'},
        },
      },
      animation: {
        blink: 'blink 1.1s steps(1) infinite',
      },
    }
  },
  plugins: [],
};
