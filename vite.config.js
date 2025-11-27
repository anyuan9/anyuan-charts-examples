import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // 开发或打包构建时用到的公共基础路径
    base: `/${env.VITE_APP_CONTEXT}/`,
    resolve: {
      alias: {
        // @ 符号指向 src 目录
        "@": resolve(__dirname, "src"),
        // @@ 符号指向 src/common 通用目录
        "@@": resolve(__dirname, "src/common"),
      },
    },
    plugins: [
      vue(),
      basicSsl(), // 自动生成https证书
      // Mock插件
      viteMockServe({
        mockPath: "./mock", // 指定mock文件的路径，默认为'mock'
        enable: command === "serve" && true, // 是否启用mock，默认为true
        watchFiles: true, // 监听 mock 文件变化，默认为true
        logger: true, // 是否在控制台显示请求日志，默认为true
        ignore: (fileName) => ["_util"].includes(fileName), // 忽略的文件，默认为undefined
        // configPath: 'vite.mock.config.ts', // mock配置文件路径，默认为'vite.mock.config.ts'
      }),
    ],
    // 开发环境服务器配置
    server: {
      https: true,
      // 是否监听所有地址
      host: true,
      // 端口号
      port: 3333,
      // 端口被占用时，是否直接退出
      strictPort: false,
      // 是否自动打开浏览器
      open: true,
      // 反向代理
      proxy: {
        "/api": {
          target: "http://localhost:33500",
          // 是否为 WebSocket
          ws: false,
          // 是否允许跨域
          changeOrigin: true,
          // 使用pathRewrite无效
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      // 是否允许跨域
      cors: true,
      // 预热常用文件，提高初始页面加载速度
      warmup: {
        clientFiles: [
          "./src/layouts/**/*.*",
          "./src/pinia/**/*.*",
          "./src/router/**/*.*",
        ],
      },
    },
  };
});
