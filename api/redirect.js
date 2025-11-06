// Endpoint: /api/redirect
export default function handler(req, res) {
  try {
    // Extract query string parameters
    const { cid, affid, sub1 } = req.query;

    // Validate required parameters
    if (!cid) {
      return res.status(400).json({ error: 'The cid parameter is required' });
    }

    // Detect if mobile or web
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);


    // Build the destination URL
    const baseUrl = isMobile 
      ? 'https://mov-version.com/' 
      : 'https://pc-version.com/';

    const params = new URLSearchParams({
      nid: '3316',
      transaction_id: cid,
      status: 'approved',
      adv1: affid || '',
      adv2: sub1 || ''
    });

    const redirectUrl = `${baseUrl}?${params.toString()}`;

    console.log({
      userAgent,
      isMobile,
      redirectUrl
    });

    // Redirect with 302 status code (temporary redirect)
    res.redirect(302, redirectUrl);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}