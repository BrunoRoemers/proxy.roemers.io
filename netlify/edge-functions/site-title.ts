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
    if (siteRes.status !== 200) {
      return jsonResponse(
        { error: `failed to fetch site: ${siteRes.status}` },
        siteRes.status
      );
    }

    const siteHtml = await siteRes.text();
    console.log(siteHtml);
    const siteTitle = (siteHtml.match(/<title>([\s\S]*?)<\/title>/i) ?? [])[1];

    return jsonResponse({
      value: siteTitle,
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
