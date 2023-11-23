const jsonResponse = <T extends {}>(json: T, statusCode = 200) =>
  new Response(JSON.stringify(json), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

export default async (request: Request) => {
  const inboundUrl = new URL(request.url);
  const outboundUrl = inboundUrl.searchParams.get("url");
  if (outboundUrl === null) {
    const res = { error: "missing request parameter: url" };
    return jsonResponse(res, 400);
  }

  return jsonResponse({
    value: `hello world -- ${outboundUrl}`,
  });
};

export const config = { path: "/site-title" };
