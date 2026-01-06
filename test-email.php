<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    Mail::raw('This is a test email from AgriPadi system.', function ($message) {
        $message->to('test@example.com')
                ->subject('AgriPadi Test Email');
    });

    echo "✅ Email sent successfully!\n";
    echo "Check your Mailtrap inbox at: https://mailtrap.io/inboxes/4290803/messages\n";
} catch (Exception $e) {
    echo "❌ Error sending email:\n";
    echo $e->getMessage() . "\n";
}
