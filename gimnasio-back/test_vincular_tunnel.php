<?php
$ch = curl_init('https://ml2f0sbf-8000.brs.devtunnels.ms/api/integraciones/telegram/vincular');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-KEY: dubss_n8n_secret_key_2026',
    'X-Tunnel-Skip-Anti-Phishing-Page: true'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'token' => 'TG-PRUEBA',
    'telegram_chat_id' => '7736184907',
    'telegram_user_id' => '7736184907'
]));
$res = curl_exec($ch);
$info = curl_getinfo($ch);
echo "STATUS: " . $info['http_code'] . "\n";
echo "BODY: " . $res . "\n";

