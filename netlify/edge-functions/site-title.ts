export default async (request: Request) => {
  const inboundUrl = new URL(request.url)
  const outboundUrl = inboundUrl.searchParams.get('url')
  if (outboundUrl === null) {
    throw new Error('expected request parameter named "url"')
  }

  const res = {
    value: `hello world -- ${outboundUrl}`
  }
  return new Response(JSON.stringify(res), {
  status: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});}

export const config = { path: "/site-title" };
