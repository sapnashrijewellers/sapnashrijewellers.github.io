export default function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}
