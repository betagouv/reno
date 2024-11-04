export async function GET() {
  const siteId = '101';
  const apiToken = process.env.MATOMO_API_TOKEN;
  const startDate = '2024-08-15';
  const funnelId = 113
  const matomoUrl = `https://stats.beta.gouv.fr/?module=API&method=Funnels.getFunnelFlow&idSite=${siteId}&idFunnel=${funnelId}&period=week&date=last10&format=JSON`;
  try {
    const response = await fetch(
      matomoUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_auth: apiToken,
          date: startDate
        }),
      }
    );
    if (!response.ok) throw new Error('Failed to fetch data from Matomo');
    const data = await response.json();
    console.log("data", data)
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
