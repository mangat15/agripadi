<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maklum Balas dari Pegawai Pertanian</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header h2 {
            margin-top: 15px;
            font-size: 20px;
        }
        .content {
            padding: 30px 20px;
        }
        .feedback-box {
            background: #f3f4f6;
            border-left: 4px solid #9ca3af;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .feedback-box-title {
            font-weight: bold;
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .feedback-box-content {
            color: #374151;
        }
        .response-box {
            background: #dbeafe;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .response-box-title {
            font-weight: bold;
            color: #1e40af;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .response-box-content {
            color: #1e3a8a;
            line-height: 1.8;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
        }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
        .rating-stars {
            color: #fbbf24;
            font-size: 18px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-logo">
                @php
                    $logoPath = public_path('logo1.png');
                    $logoData = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';
                @endphp
                @if($logoData)
                    <img src="data:image/png;base64,{{ $logoData }}" alt="AgriPadi Logo" style="width: 50px; height: 50px; border-radius: 50%;">
                @endif
                <div>
                    <h1 style="margin: 0; font-size: 24px;">AgriPadi</h1>
                    <div style="font-size: 14px; margin-top: 5px; opacity: 0.95;">Empowering Farmers Through Technology 🌾</div>
                </div>
            </div>
            <h2 style="margin-top: 15px; font-size: 20px;">Maklum Balas dari Pegawai Pertanian</h2>
        </div>

        <div class="content">
            <p><strong>Assalamualaikum {{ $feedback->user->name }},</strong></p>

            <p>Terima kasih kerana memberikan maklum balas anda kepada kami. Pegawai pertanian kami telah memberi respons kepada maklum balas anda.</p>

            <div class="feedback-box">
                <div class="feedback-box-title">Maklum Balas Anda</div>
                <div class="feedback-box-content">
                    {{ $feedback->message }}
                </div>
                @if($feedback->rating)
                    <div class="rating-stars">
                        @for($i = 1; $i <= 5; $i++)
                            @if($i <= $feedback->rating)
                                ⭐
                            @else
                                ☆
                            @endif
                        @endfor
                        ({{ $feedback->rating }}/5)
                    </div>
                @endif
                @if($feedback->feature)
                    <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">
                        <strong>Ciri:</strong> {{ $feedback->feature }}
                    </p>
                @endif
            </div>

            @if($feedback->admin_notes)
                <div class="response-box">
                    <div class="response-box-title">📢 Respons dari Pegawai Pertanian:</div>
                    <div class="response-box-content">
                        {!! nl2br(e($feedback->admin_notes)) !!}
                    </div>
                </div>
            @endif

            <p>Kami menghargai masa dan input anda dalam membantu kami memperbaiki platform AgriPadi. Maklum balas seperti anda sangat berharga untuk terus meningkatkan perkhidmatan kami.</p>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/farmer/dashboard" class="button">Ke Platform AgriPadi</a>
            </div>
        </div>

        <div class="footer">
            <p><strong>AgriPadi</strong> - Platform Pembelajaran Pertanian Padi</p>
            <p>Anda menerima email ini kerana anda telah memberikan maklum balas kepada kami.</p>
            <p>Untuk sebarang pertanyaan, sila hubungi kami melalui <a href="{{ config('app.url') }}">platform AgriPadi</a>.</p>
        </div>
    </div>
</body>
</html>
