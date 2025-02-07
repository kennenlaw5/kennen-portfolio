<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@yield('title', 'Kennen Lawrence Portfolio')</title>
  <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  <script>
    window.APP_CONFIG = @js(config('app.contact'));
  </script>
</head>
<body class="bg-gray-100 text-gray-900">
  @yield('content')
  <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>

