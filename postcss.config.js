module.exports = {
    plugins: [
        // require('@tailwindcss/postcss')(),
        require('tailwindcss')('./tailwind.config.cjs'),
        require('autoprefixer'),
    ],
  };
  