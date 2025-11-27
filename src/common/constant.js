// 接口请求的基准地址
// import.meta.env:
// {
//   BASE_URL: "/vue3-vite-emptycup/",
//   MODE: "development",
//   DEV: true,
//   PROD: false,
//   SSR: false
// }
export const API_BASE_URL = {
  staging: "",
  production: "",
  development: `${import.meta.env.VITE_API_PREFIX}`,
}[import.meta.env.MODE];

// 获取 csrf 配置
// eslint-disable-next-line import/no-mutable-exports
let CSRF_HEADER = "X-CSRF-TOKEN";
// eslint-disable-next-line import/no-mutable-exports
let CSRF_TOKEN = "";
if (import.meta.env.VITE_CSRF_ENABLE === "enable" && !import.meta.env.DEV) {
  if (document.querySelector("meta[name=_csrf]")) {
    CSRF_TOKEN =
      document.querySelector("meta[name=_csrf]")?.getAttribute("content") || "";
    CSRF_HEADER =
      document
        .querySelector("meta[name=_csrf_header]")
        ?.getAttribute("content") || "X-CSRF-TOKEN";
  }
}
export { CSRF_HEADER, CSRF_TOKEN };
