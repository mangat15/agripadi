<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengumuman Baru</title>
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
            background: linear-gradient(135deg, #16a34a 0%, #10b981 100%);
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
        .header-logo img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header .tagline {
            font-size: 14px;
            margin-top: 5px;
            opacity: 0.95;
        }
        .content {
            padding: 30px 20px;
        }
        .announcement-category {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        .announcement-title {
            color: #16a34a;
            font-size: 22px;
            font-weight: bold;
            margin: 15px 0;
        }
        .announcement-content {
            color: #555;
            margin: 20px 0;
            line-height: 1.8;
        }
        .announcement-image {
            width: 100%;
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #10b981 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover {
            background: linear-gradient(135deg, #15803d 0%, #059669 100%);
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
            color: #16a34a;
            text-decoration: none;
        }
        .published-date {
            color: #888;
            font-size: 14px;
            margin-top: 10px;
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
                    <img src="data:image/png;base64,{{ $logoData }}" alt="AgriPadi Logo">
                @endif
                <div>
                    <h1>AgriPadi</h1>
                    <div class="tagline">Empowering Farmers Through Technology 🌾</div>
                </div>
            </div>
        </div>

        <div class="content">
            <p><strong>Assalamualaikum dan Salam Sejahtera,</strong></p>

            @if($announcement->category)
                <span class="announcement-category">{{ $announcement->category }}</span>
            @endif

            <h2 class="announcement-title">{{ $announcement->title }}</h2>

            <div class="announcement-content">
                {!! nl2br(e($announcement->content)) !!}
            </div>

            @if($announcement->image)
                @php
                    $imagePath = storage_path('app/public/' . $announcement->image);
                    $imageData = file_exists($imagePath) ? base64_encode(file_get_contents($imagePath)) : '';
                    $imageExt = pathinfo($announcement->image, PATHINFO_EXTENSION);
                    $mimeType = in_array($imageExt, ['jpg', 'jpeg']) ? 'image/jpeg' : 'image/' . $imageExt;
                @endphp
                @if($imageData)
                    <img src="data:{{ $mimeType }};base64,{{ $imageData }}" alt="{{ $announcement->title }}" class="announcement-image">
                @endif
            @endif

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/farmer/dashboard" class="button">Lihat Di Platform AgriPadi</a>
            </div>

            <p class="published-date">
                Tarikh: {{ $announcement->published_at ? $announcement->published_at->format('d F Y, g:i A') : now()->format('d F Y, g:i A') }}
            </p>
        </div>

        <div class="footer">
            <p><strong>AgriPadi</strong> - Platform Pembelajaran Pertanian Padi</p>
            <p>Anda menerima email ini kerana anda berdaftar sebagai pengguna AgriPadi.</p>
            <p>Untuk mengubah tetapan notifikasi, sila log masuk ke <a href="{{ config('app.url') }}">platform AgriPadi</a>.</p>
        </div>
    </div>
</body>
</html>
