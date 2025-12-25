<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Prevent lazy loading in production to catch N+1 query issues
        Model::preventLazyLoading(! app()->isProduction());

        // Prevent silently discarding attributes
        Model::preventSilentlyDiscardingAttributes(! app()->isProduction());
    }
}
