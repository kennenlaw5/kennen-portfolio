<?php

use App\Http\Controllers\ResumeDownloadController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'home.index')->name('home');
Route::get('/resume/download', [ResumeDownloadController::class, 'download'])
    ->middleware('throttle:resume-download')
    ->name('resume.download');
Route::view('/games', 'games.index')->name('games');
Route::view('/projects', 'projects.index')->name('projects');
Route::view('/experience', 'experience.index')->name('experience');
Route::view('/skills', 'skills.index')->name('skills');
Route::view('/contact', 'contact.index')->name('contact');
