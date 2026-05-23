<?php
return [
  'BASE_URL' => 'https://www.ejemplo.com',
  'FROM_EMAIL' => 'no-reply@ejemplo.com',
  'FROM_NAME' => 'Sergi Alari',

// ===== Brevo (Sendinblue) =====
'BREVO_API_KEY' => 'REEMPLAZA_CON_TU_API_KEY',  // obligatorio
'BREVO_LIST_ID' => 0,                           // obligatorio (int)
'BREVO_DOI_TEMPLATE_ID' => 0,                   // obligatorio (int)
'BREVO_REDIRECT_URL' => 'https://www.ejemplo.com/confirmado.html', // tras confirmar
];
