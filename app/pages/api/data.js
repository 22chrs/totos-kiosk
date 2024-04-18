// pages/api/data.js
export default function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1200, stale-while-revalidate=600',
  );
  res.status(200).json({ data: 'This is some data' });
}
