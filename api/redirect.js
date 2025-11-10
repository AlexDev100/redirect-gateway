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
      ? process.env.MOBILE_REDIRECT_URL
      : process.env.DESKTOP_REDIRECT_URL;

    const params = new URLSearchParams({
      cid: cid,
      affid: affid || '',
      sub1: sub1 || ''
    });

    // Backup hash parameters (in case some trackers need them)
    const hashParams = `#cid=${cid}&affid=${affid || ''}&sub1=${sub1 || ''}`;

    let redirectUrl;

    if (isMobile) {
      //redirectUrl = `${baseUrl}?${params.toString()}`;
      redirectUrl = `${baseUrl}?${params.toString()}${hashParams}`;
    } else {
      //redirectUrl = `${baseUrl}&${params.toString()}`;
      redirectUrl = `${baseUrl}&${params.toString()}${hashParams}`;
    }

    /* console.log({
      userAgent,
      isMobile,
      redirectUrl
    }); */

    // Enhanced logging
    const logData = {
      timestamp: new Date().toISOString(),
      userAgent,
      isMobile,
      device: isMobile ? 'MOBILE' : 'DESKTOP',
      referer: req.headers['referer'] || 'direct',
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      params: {
        cid: cid || 'MISSING',
        affid: affid || 'MISSING',
        sub1: sub1 || 'MISSING'
      },
      redirectUrl,
      fullRequestUrl: req.url
    };
    
    console.log('REDIRECT_LOG:', JSON.stringify(logData));

    // Redirect with 302 status code (temporary redirect)
    res.redirect(302, redirectUrl);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}