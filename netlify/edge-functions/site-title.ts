export default () => {
  const res = {
    value: "hello world"
  }
  return new Response(JSON.stringify(res), {
  status: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});}

export const config = { path: "/site-title" };
