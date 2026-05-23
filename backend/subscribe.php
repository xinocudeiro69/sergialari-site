<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$cfg = @include __DIR__.'/config.php';
if(!$cfg){ $cfg = @include __DIR__.'/config.sample.php'; }

$raw = file_get_contents('php://input');
$in = json_decode($raw, true);

$nombre = trim($in['nombre'] ?? '');
$origen = trim($in['origen'] ?? '');
$email  = trim($in['email']  ?? '');
$consent= !!($in['consent'] ?? false);

if(!$nombre || !$email || !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)){
  echo json_encode(['ok'=>false,'error'=>'Datos inválidos']); exit;
}

$apiKey = $cfg['BREVO_API_KEY'] ?? '';
$listId = intval($cfg['BREVO_LIST_ID'] ?? 0);
$templateId = intval($cfg['BREVO_DOI_TEMPLATE_ID'] ?? 0);
$redirect = $cfg['BREVO_REDIRECT_URL'] ?? '';

if(!$apiKey || !$listId || !$templateId || !$redirect){
  echo json_encode(['ok'=>false,'error'=>'Falta configurar Brevo en backend/config.php']); exit;
}

// Respaldo CSV
$csvDir = __DIR__.'/../data';
if(!is_dir($csvDir)) @mkdir($csvDir, 0775, true);
$csv = $csvDir.'/subscribers.csv';
if(!file_exists($csv)){
  file_put_contents($csv, "timestamp,nombre,origen,email,consent\n");
}
file_put_contents($csv, date('c').",".str_replace(["\n","\r",","],' ',$nombre).",".str_replace(["\n","\r",","],' ',$origen).",$email,".($consent?'1':'0')."\n", FILE_APPEND);

// Brevo DOI API
$payload = [
  'email' => $email,
  'attributes' => [
    'FIRSTNAME' => $nombre,
    'ORIGEN'    => $origen
  ],
  'includeListIds' => [$listId],
  'templateId' => $templateId,
  'redirectionUrl' => $redirect
];

$ch = curl_init('https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'accept: application/json',
  'content-type: application/json',
  'api-key: ' . $apiKey
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$resp = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if($http>=200 && $http<300){
  echo json_encode(['ok'=>true]);
} else {
  echo json_encode(['ok'=>false,'error'=>'Brevo API error','status'=>$http,'details'=>$resp,'curl_error'=>$err]);
}
