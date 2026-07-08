<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

if (!empty($_POST['website'])) {
    exit(json_encode(['ok' => true]));
}

function clean($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

$projektart      = clean($_POST['projektart'] ?? '');
$projektstatus   = clean($_POST['projektstatus'] ?? '');
$branche         = clean($_POST['branche'] ?? '');
$zeitrahmen      = clean($_POST['zeitrahmen'] ?? '');
$name            = clean($_POST['name'] ?? '');
$email           = clean($_POST['email'] ?? '');
$message         = clean($_POST['message'] ?? '');

if (!$projektart || !$projektstatus || !$branche || !$zeitrahmen || !$name || !$email) {
    http_response_code(400);
    exit(json_encode(['error' => 'Fehlende Angaben']));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Ungültige E-Mail']));
}

$to      = 'info@mikaschieferdecker.de';
$subject = "Neue Projektanfrage: $projektart ($name)";

$body = "Neue qualifizierte Anfrage über die Website:\n\n"
      . "Projektart: $projektart\n"
      . "Status: $projektstatus\n"
      . "Branche: $branche\n"
      . "Zeitrahmen: $zeitrahmen\n\n"
      . "Name: $name\n"
      . "E-Mail: $email\n"
      . "Nachricht:\n$message\n";

$headers = "From: website@mikaschieferdecker.de\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail konnte nicht gesendet werden']);
}
