export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { nombre, origen, email, consent } = req.body || {};

  if (!nombre || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Datos inválidos' });
  }

  const apiKey     = process.env.BREVO_API_KEY;
  const listId     = parseInt(process.env.BREVO_LIST_ID || '0');
  const templateId = parseInt(process.env.BREVO_DOI_TEMPLATE_ID || '0');
  const redirect   = process.env.BREVO_REDIRECT_URL || '';

  if (!apiKey || !listId || !templateId || !redirect) {
    // Si no hay config de Brevo, respondemos OK igualmente para no bloquear al usuario
    console.warn('Brevo no configurado — suscripción no enviada');
    return res.status(200).json({ ok: true, warn: 'brevo_not_configured' });
  }

  try {
    const r = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: nombre, ORIGEN: origen || '' },
        includeListIds: [listId],
        templateId,
        redirectionUrl: redirect
      })
    });

    if (r.status >= 200 && r.status < 300) {
      return res.status(200).json({ ok: true });
    }
    const details = await r.text();
    return res.status(200).json({ ok: false, error: 'Brevo API error', status: r.status, details });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
