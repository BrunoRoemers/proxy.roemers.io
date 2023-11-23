const jsonResponse = <T extends {}>(json: T, statusCode = 200) =>
  new Response(JSON.stringify(json), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default async (request: Request) => {
  const inboundUrl = new URL(request.url);
  try {
    const rawOutboundUrl = inboundUrl.searchParams.get("url");
    if (rawOutboundUrl === null) {
      throw new HttpError("missing request parameter: url");
    }

    if (!URL.canParse(rawOutboundUrl)) {
      throw new HttpError(`url is not valid: ${rawOutboundUrl}`);
    }

    const siteRes = await fetch(rawOutboundUrl);
    const siteHtml = await siteRes.text();
    console.log(siteRes);
    console.log(siteHtml);

    return jsonResponse({
      value: `hello world -- ${rawOutboundUrl}`,
    });
  } catch (e) {
    if (e instanceof HttpError) {
      return jsonResponse({ error: e.message }, e.statusCode);
    } else {
      console.error(inboundUrl, e);
      return jsonResponse({ error: "internal server error" }, 500);
    }
  }
};

export const config = { path: "/site-title" };
