<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

// Honeypot: gefülltes Feld => Bot, still mit OK antworten
if (!empty($_POST['website'])) {
    exit(json_encode(['ok' => true]));
}

function clean($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

$email     = clean($_POST['email'] ?? '');
$shop_url  = clean($_POST['shop_url'] ?? '');
$interesse = clean($_POST['interesse'] ?? '');

$erlaubt = ['Bezahlte Werbeanzeigen', 'Shop-Optimierung', 'Alles Zusammen'];

if (!$email || !$shop_url || !$interesse) {
    http_response_code(400);
    exit(json_encode(['error' => 'Fehlende Angaben']));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Ungültige E-Mail']));
}

if (!in_array($interesse, $erlaubt, true)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Ungültige Auswahl']));
}

$to      = 'info@mikaschieferdecker.de';
$subject = "Neue Shop-Analyse-Anfrage: $interesse";

$body = "Neue Anfrage für die kostenlose Shop-Analyse:\n\n"
      . "E-Mail: $email\n"
      . "Shop-URL: $shop_url\n"
      . "Interesse: $interesse\n";

$headers = "From: website@mikaschieferdecker.de\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail konnte nicht gesendet werden']);
}
