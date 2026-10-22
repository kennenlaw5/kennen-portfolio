<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#020617">
  <title>@yield('title', 'Kennen Lawrence Portfolio')</title>
  <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="32x32">
  <link rel="icon" href="{{ asset('favicon-32x32.png') }}" type="image/png" sizes="32x32">
  <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
  <link rel="stylesheet" href="{{ asset('css/appStyles.css') }}">
  <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  <script>
    window.APP_CONFIG = @js([
      ...config('app.contact'),
      'analytics' => config('analytics'),
    ]);
  </script>
</head>
<body class="bg-slate-950 text-slate-300 antialiased">
  @yield('content')
  <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
