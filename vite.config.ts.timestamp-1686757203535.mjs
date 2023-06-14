// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3, { resolve as resolve3 } from "path";

// utils/plugins/make-manifest.ts
import * as fs from "fs";
import * as path from "path";

// utils/log.ts
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};

// utils/manifest-parser/index.ts
var ManifestParser = class {
  constructor() {
  }
  static convertManifestToString(manifest2) {
    return JSON.stringify(manifest2, null, 2);
  }
};
var manifest_parser_default = ManifestParser;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname = "D:\\Web Dev Stuff\\chaos-shopper-chrome-extension\\utils\\plugins";
var { resolve } = path;
var distDir = resolve(__vite_injected_original_dirname, "..", "..", "dist");
var publicDir = resolve(__vite_injected_original_dirname, "..", "..", "public");
function makeManifest(manifest2, config) {
  function makeManifest2(to) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, "manifest.json");
    if (config.contentScriptCssKey) {
      manifest2.content_scripts.forEach((script) => {
        script.css = script.css.map(
          (css) => css.replace("<KEY>", config.contentScriptCssKey)
        );
      });
    }
    fs.writeFileSync(
      manifestPath,
      manifest_parser_default.convertManifestToString(manifest2)
    );
    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  }
  return {
    name: "make-manifest",
    buildStart() {
      if (config.isDev) {
        makeManifest2(distDir);
      }
    },
    buildEnd() {
      if (config.isDev) {
        return;
      }
      makeManifest2(publicDir);
    }
  };
}

// utils/plugins/custom-dynamic-import.ts
function customDynamicImport() {
  return {
    name: "custom-dynamic-import",
    renderDynamicImport() {
      return {
        left: `
        {
          const dynamicImport = (path) => import(path);
          dynamicImport(
          `,
        right: ")}"
      };
    }
  };
}

// utils/plugins/add-hmr.ts
import * as path2 from "path";
import { readFileSync } from "fs";
var __vite_injected_original_dirname2 = "D:\\Web Dev Stuff\\chaos-shopper-chrome-extension\\utils\\plugins";
var isDev = process.env.__DEV__ === "true";
var DUMMY_CODE = `export default function(){};`;
function getInjectionCode(fileName) {
  return readFileSync(
    path2.resolve(__vite_injected_original_dirname2, "..", "reload", "injections", fileName),
    { encoding: "utf8" }
  );
}
function addHmr(config) {
  const { background = false, view = true } = config || {};
  const idInBackgroundScript = "virtual:reload-on-update-in-background-script";
  const idInView = "virtual:reload-on-update-in-view";
  const scriptHmrCode = isDev ? getInjectionCode("script.js") : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode("view.js") : DUMMY_CODE;
  return {
    name: "add-hmr",
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }
      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    }
  };
}
function getResolvedId(id) {
  return "\0" + id;
}

// package.json
var package_default = {
  name: "chaos-shopper-chrome-extension",
  version: "0.0.1",
  description: "To buy or not to buy? Let Chaos Shopper decide!",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/itsdaijoebu/chaos-shopper-chrome-extension.git"
  },
  scripts: {
    build: "tsc --noEmit && vite build",
    "build:watch": "cross-env __DEV__=true vite build --watch",
    "build:hmr": "rollup --config utils/reload/rollup.config.ts",
    wss: "node utils/reload/initReloadServer.js",
    dev: "npm run build:hmr && (run-p wss build:watch)",
    test: "jest"
  },
  type: "module",
  dependencies: {
    react: "18.2.0",
    "react-dom": "18.2.0"
  },
  devDependencies: {
    "@rollup/plugin-typescript": "^8.5.0",
    "@testing-library/react": "13.4.0",
    "@types/chrome": "0.0.224",
    "@types/jest": "29.0.3",
    "@types/node": "18.15.11",
    "@types/react": "18.0.21",
    "@types/react-dom": "18.2.4",
    "@types/ws": "^8.5.4",
    "@typescript-eslint/eslint-plugin": "5.56.0",
    "@typescript-eslint/parser": "5.38.1",
    "@vitejs/plugin-react": "2.2.0",
    chokidar: "^3.5.3",
    "cross-env": "^7.0.3",
    eslint: "8.36.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "4.2.1",
    "eslint-plugin-react": "7.32.2",
    "fs-extra": "11.1.0",
    jest: "29.0.3",
    "jest-environment-jsdom": "29.5.0",
    "npm-run-all": "^4.1.5",
    prettier: "2.8.8",
    rollup: "2.79.1",
    sass: "1.62.1",
    "ts-jest": "29.0.2",
    "ts-loader": "9.4.2",
    typescript: "4.8.3",
    vite: "3.1.3",
    ws: "8.13.0"
  }
};

// manifest.ts
var manifest = {
  manifest_version: 3,
  name: package_default.name,
  version: package_default.version,
  description: package_default.description,
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png"
  },
  icons: {
    "128": "icon-128.png"
  },
  content_scripts: [
    {
      "matches": ["*://*/*"],
      "include_globs": [
        "*://*.amazon.*/*"
      ],
      js: ["src/pages/content/index.js"],
      css: ["assets/css/contentStyle<KEY>.chunk.css"]
    }
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png"
      ],
      matches: ["*://*/*"]
    }
  ]
};
var manifest_default = manifest;

// vite.config.ts
var __vite_injected_original_dirname3 = "D:\\Web Dev Stuff\\chaos-shopper-chrome-extension";
var root = resolve3(__vite_injected_original_dirname3, "src");
var pagesDir = resolve3(root, "pages");
var assetsDir = resolve3(root, "assets");
var outDir = resolve3(__vite_injected_original_dirname3, "dist");
var publicDir2 = resolve3(__vite_injected_original_dirname3, "public");
var isDev2 = process.env.__DEV__ === "true";
var isProduction = !isDev2;
var enableHmrInBackgroundScript = true;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir
    }
  },
  plugins: [
    react(),
    makeManifest(manifest_default, {
      isDev: isDev2,
      contentScriptCssKey: regenerateCacheInvalidationKey()
    }),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true })
  ],
  publicDir: publicDir2,
  build: {
    outDir,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      input: {
        devtools: resolve3(pagesDir, "devtools", "index.html"),
        panel: resolve3(pagesDir, "panel", "index.html"),
        content: resolve3(pagesDir, "content", "index.ts"),
        background: resolve3(pagesDir, "background", "index.ts"),
        contentStyle: resolve3(pagesDir, "content", "style.scss"),
        popup: resolve3(pagesDir, "popup", "index.html"),
        newtab: resolve3(pagesDir, "newtab", "index.html"),
        options: resolve3(pagesDir, "options", "index.html")
      },
      watch: {
        include: ["src/**", "vite.config.ts"],
        exclude: ["node_modules/**", "src/**/*.spec.ts"]
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: isDev2 ? "assets/js/[name].js" : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path3.parse(assetInfo.name);
          const assetFolder = dir.split("/").at(-1);
          const name = assetFolder + firstUpperCase(_name);
          if (name === "contentStyle") {
            return `assets/css/contentStyle${cacheInvalidationKey}.chunk.css`;
          }
          return `assets/[ext]/${name}.chunk.[ext]`;
        }
      }
    }
  }
});
function firstUpperCase(str) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}
var cacheInvalidationKey = generateKey();
function regenerateCacheInvalidationKey() {
  cacheInvalidationKey = generateKey();
  return cacheInvalidationKey;
}
function generateKey() {
  return `${(Date.now() / 100).toFixed()}`;
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInV0aWxzL2xvZy50cyIsICJ1dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHMiLCAidXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAidXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzIiwgIm1hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcV2ViIERldiBTdHVmZlxcXFxjaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFdlYiBEZXYgU3R1ZmZcXFxcY2hhb3Mtc2hvcHBlci1jaHJvbWUtZXh0ZW5zaW9uXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9XZWIlMjBEZXYlMjBTdHVmZi9jaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgbWFrZU1hbmlmZXN0IGZyb20gXCIuL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdFwiO1xyXG5pbXBvcnQgY3VzdG9tRHluYW1pY0ltcG9ydCBmcm9tIFwiLi91dGlscy9wbHVnaW5zL2N1c3RvbS1keW5hbWljLWltcG9ydFwiO1xyXG5pbXBvcnQgYWRkSG1yIGZyb20gXCIuL3V0aWxzL3BsdWdpbnMvYWRkLWhtclwiO1xyXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vbWFuaWZlc3RcIjtcclxuXHJcbmNvbnN0IHJvb3QgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIik7XHJcbmNvbnN0IHBhZ2VzRGlyID0gcmVzb2x2ZShyb290LCBcInBhZ2VzXCIpO1xyXG5jb25zdCBhc3NldHNEaXIgPSByZXNvbHZlKHJvb3QsIFwiYXNzZXRzXCIpO1xyXG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpO1xyXG5jb25zdCBwdWJsaWNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWNcIik7XHJcblxyXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Ll9fREVWX18gPT09IFwidHJ1ZVwiO1xyXG5jb25zdCBpc1Byb2R1Y3Rpb24gPSAhaXNEZXY7XHJcblxyXG4vLyBFTkFCTEUgSE1SIElOIEJBQ0tHUk9VTkQgU0NSSVBUXHJcbmNvbnN0IGVuYWJsZUhtckluQmFja2dyb3VuZFNjcmlwdCA9IHRydWU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQHNyY1wiOiByb290LFxyXG4gICAgICBcIkBhc3NldHNcIjogYXNzZXRzRGlyLFxyXG4gICAgICBcIkBwYWdlc1wiOiBwYWdlc0RpcixcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbWFrZU1hbmlmZXN0KG1hbmlmZXN0LCB7XHJcbiAgICAgIGlzRGV2LFxyXG4gICAgICBjb250ZW50U2NyaXB0Q3NzS2V5OiByZWdlbmVyYXRlQ2FjaGVJbnZhbGlkYXRpb25LZXkoKSxcclxuICAgIH0pLFxyXG4gICAgY3VzdG9tRHluYW1pY0ltcG9ydCgpLFxyXG4gICAgYWRkSG1yKHsgYmFja2dyb3VuZDogZW5hYmxlSG1ySW5CYWNrZ3JvdW5kU2NyaXB0LCB2aWV3OiB0cnVlIH0pLFxyXG4gIF0sXHJcbiAgcHVibGljRGlyLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXIsXHJcbiAgICAvKiogQ2FuIHNsb3dEb3duIGJ1aWxkIHNwZWVkLiAqL1xyXG4gICAgLy8gc291cmNlbWFwOiBpc0RldixcclxuICAgIG1pbmlmeTogaXNQcm9kdWN0aW9uLFxyXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGlzUHJvZHVjdGlvbixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBkZXZ0b29sczogcmVzb2x2ZShwYWdlc0RpciwgXCJkZXZ0b29sc1wiLCBcImluZGV4Lmh0bWxcIiksXHJcbiAgICAgICAgcGFuZWw6IHJlc29sdmUocGFnZXNEaXIsIFwicGFuZWxcIiwgXCJpbmRleC5odG1sXCIpLFxyXG4gICAgICAgIGNvbnRlbnQ6IHJlc29sdmUocGFnZXNEaXIsIFwiY29udGVudFwiLCBcImluZGV4LnRzXCIpLFxyXG4gICAgICAgIGJhY2tncm91bmQ6IHJlc29sdmUocGFnZXNEaXIsIFwiYmFja2dyb3VuZFwiLCBcImluZGV4LnRzXCIpLFxyXG4gICAgICAgIGNvbnRlbnRTdHlsZTogcmVzb2x2ZShwYWdlc0RpciwgXCJjb250ZW50XCIsIFwic3R5bGUuc2Nzc1wiKSxcclxuICAgICAgICBwb3B1cDogcmVzb2x2ZShwYWdlc0RpciwgXCJwb3B1cFwiLCBcImluZGV4Lmh0bWxcIiksXHJcbiAgICAgICAgbmV3dGFiOiByZXNvbHZlKHBhZ2VzRGlyLCBcIm5ld3RhYlwiLCBcImluZGV4Lmh0bWxcIiksXHJcbiAgICAgICAgb3B0aW9uczogcmVzb2x2ZShwYWdlc0RpciwgXCJvcHRpb25zXCIsIFwiaW5kZXguaHRtbFwiKSxcclxuICAgICAgfSxcclxuICAgICAgd2F0Y2g6IHtcclxuICAgICAgICBpbmNsdWRlOiBbXCJzcmMvKipcIiwgXCJ2aXRlLmNvbmZpZy50c1wiXSxcclxuICAgICAgICBleGNsdWRlOiBbXCJub2RlX21vZHVsZXMvKipcIiwgXCJzcmMvKiovKi5zcGVjLnRzXCJdLFxyXG4gICAgICB9LFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJzcmMvcGFnZXMvW25hbWVdL2luZGV4LmpzXCIsXHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGlzRGV2XHJcbiAgICAgICAgICA/IFwiYXNzZXRzL2pzL1tuYW1lXS5qc1wiXHJcbiAgICAgICAgICA6IFwiYXNzZXRzL2pzL1tuYW1lXS5baGFzaF0uanNcIixcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgeyBkaXIsIG5hbWU6IF9uYW1lIH0gPSBwYXRoLnBhcnNlKGFzc2V0SW5mby5uYW1lKTtcclxuICAgICAgICAgIGNvbnN0IGFzc2V0Rm9sZGVyID0gZGlyLnNwbGl0KFwiL1wiKS5hdCgtMSk7XHJcbiAgICAgICAgICBjb25zdCBuYW1lID0gYXNzZXRGb2xkZXIgKyBmaXJzdFVwcGVyQ2FzZShfbmFtZSk7XHJcbiAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjb250ZW50U3R5bGVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYGFzc2V0cy9jc3MvY29udGVudFN0eWxlJHtjYWNoZUludmFsaWRhdGlvbktleX0uY2h1bmsuY3NzYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tleHRdLyR7bmFtZX0uY2h1bmsuW2V4dF1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZmlyc3RVcHBlckNhc2Uoc3RyOiBzdHJpbmcpIHtcclxuICBjb25zdCBmaXJzdEFscGhhYmV0ID0gbmV3IFJlZ0V4cCgvKCB8XilbYS16XS8sIFwiZ1wiKTtcclxuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZShmaXJzdEFscGhhYmV0LCAoTCkgPT4gTC50b1VwcGVyQ2FzZSgpKTtcclxufVxyXG5cclxubGV0IGNhY2hlSW52YWxpZGF0aW9uS2V5OiBzdHJpbmcgPSBnZW5lcmF0ZUtleSgpO1xyXG5mdW5jdGlvbiByZWdlbmVyYXRlQ2FjaGVJbnZhbGlkYXRpb25LZXkoKSB7XHJcbiAgY2FjaGVJbnZhbGlkYXRpb25LZXkgPSBnZW5lcmF0ZUtleSgpO1xyXG4gIHJldHVybiBjYWNoZUludmFsaWRhdGlvbktleTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVLZXkoKTogc3RyaW5nIHtcclxuICByZXR1cm4gYCR7KERhdGUubm93KCkgLyAxMDApLnRvRml4ZWQoKX1gO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcV2ViIERldiBTdHVmZlxcXFxjaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb25cXFxcdXRpbHNcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcV2ViIERldiBTdHVmZlxcXFxjaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb25cXFxcdXRpbHNcXFxccGx1Z2luc1xcXFxtYWtlLW1hbmlmZXN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9XZWIlMjBEZXYlMjBTdHVmZi9jaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb24vdXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzXCI7aW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGNvbG9yTG9nIGZyb20gXCIuLi9sb2dcIjtcclxuaW1wb3J0IE1hbmlmZXN0UGFyc2VyIGZyb20gXCIuLi9tYW5pZmVzdC1wYXJzZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuY29uc3QgeyByZXNvbHZlIH0gPSBwYXRoO1xyXG5cclxuY29uc3QgZGlzdERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCJkaXN0XCIpO1xyXG5jb25zdCBwdWJsaWNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwicHVibGljXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZU1hbmlmZXN0KFxyXG4gIG1hbmlmZXN0OiBjaHJvbWUucnVudGltZS5NYW5pZmVzdFYzLFxyXG4gIGNvbmZpZzogeyBpc0RldjogYm9vbGVhbjsgY29udGVudFNjcmlwdENzc0tleT86IHN0cmluZyB9XHJcbik6IFBsdWdpbk9wdGlvbiB7XHJcbiAgZnVuY3Rpb24gbWFrZU1hbmlmZXN0KHRvOiBzdHJpbmcpIHtcclxuICAgIGlmICghZnMuZXhpc3RzU3luYyh0bykpIHtcclxuICAgICAgZnMubWtkaXJTeW5jKHRvKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHJlc29sdmUodG8sIFwibWFuaWZlc3QuanNvblwiKTtcclxuXHJcbiAgICAvLyBOYW1pbmcgY2hhbmdlIGZvciBjYWNoZSBpbnZhbGlkYXRpb25cclxuICAgIGlmIChjb25maWcuY29udGVudFNjcmlwdENzc0tleSkge1xyXG4gICAgICBtYW5pZmVzdC5jb250ZW50X3NjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiB7XHJcbiAgICAgICAgc2NyaXB0LmNzcyA9IHNjcmlwdC5jc3MubWFwKChjc3MpID0+XHJcbiAgICAgICAgICBjc3MucmVwbGFjZShcIjxLRVk+XCIsIGNvbmZpZy5jb250ZW50U2NyaXB0Q3NzS2V5KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZzLndyaXRlRmlsZVN5bmMoXHJcbiAgICAgIG1hbmlmZXN0UGF0aCxcclxuICAgICAgTWFuaWZlc3RQYXJzZXIuY29udmVydE1hbmlmZXN0VG9TdHJpbmcobWFuaWZlc3QpXHJcbiAgICApO1xyXG5cclxuICAgIGNvbG9yTG9nKGBNYW5pZmVzdCBmaWxlIGNvcHkgY29tcGxldGU6ICR7bWFuaWZlc3RQYXRofWAsIFwic3VjY2Vzc1wiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcIm1ha2UtbWFuaWZlc3RcIixcclxuICAgIGJ1aWxkU3RhcnQoKSB7XHJcbiAgICAgIGlmIChjb25maWcuaXNEZXYpIHtcclxuICAgICAgICBtYWtlTWFuaWZlc3QoZGlzdERpcik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBidWlsZEVuZCgpIHtcclxuICAgICAgaWYgKGNvbmZpZy5pc0Rldikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBtYWtlTWFuaWZlc3QocHVibGljRGlyKTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFdlYiBEZXYgU3R1ZmZcXFxcY2hhb3Mtc2hvcHBlci1jaHJvbWUtZXh0ZW5zaW9uXFxcXHV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxXZWIgRGV2IFN0dWZmXFxcXGNoYW9zLXNob3BwZXItY2hyb21lLWV4dGVuc2lvblxcXFx1dGlsc1xcXFxsb2cudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1dlYiUyMERldiUyMFN0dWZmL2NoYW9zLXNob3BwZXItY2hyb21lLWV4dGVuc2lvbi91dGlscy9sb2cudHNcIjt0eXBlIENvbG9yVHlwZSA9IFwic3VjY2Vzc1wiIHwgXCJpbmZvXCIgfCBcImVycm9yXCIgfCBcIndhcm5pbmdcIiB8IGtleW9mIHR5cGVvZiBDT0xPUlM7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvckxvZyhtZXNzYWdlOiBzdHJpbmcsIHR5cGU/OiBDb2xvclR5cGUpIHtcclxuICBsZXQgY29sb3I6IHN0cmluZyA9IHR5cGUgfHwgQ09MT1JTLkZnQmxhY2s7XHJcblxyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBcInN1Y2Nlc3NcIjpcclxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdHcmVlbjtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0JsdWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBcImVycm9yXCI6XHJcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnUmVkO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgXCJ3YXJuaW5nXCI6XHJcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnWWVsbG93O1xyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKGNvbG9yLCBtZXNzYWdlKTtcclxufVxyXG5cclxuY29uc3QgQ09MT1JTID0ge1xyXG4gIFJlc2V0OiBcIlxceDFiWzBtXCIsXHJcbiAgQnJpZ2h0OiBcIlxceDFiWzFtXCIsXHJcbiAgRGltOiBcIlxceDFiWzJtXCIsXHJcbiAgVW5kZXJzY29yZTogXCJcXHgxYls0bVwiLFxyXG4gIEJsaW5rOiBcIlxceDFiWzVtXCIsXHJcbiAgUmV2ZXJzZTogXCJcXHgxYls3bVwiLFxyXG4gIEhpZGRlbjogXCJcXHgxYls4bVwiLFxyXG4gIEZnQmxhY2s6IFwiXFx4MWJbMzBtXCIsXHJcbiAgRmdSZWQ6IFwiXFx4MWJbMzFtXCIsXHJcbiAgRmdHcmVlbjogXCJcXHgxYlszMm1cIixcclxuICBGZ1llbGxvdzogXCJcXHgxYlszM21cIixcclxuICBGZ0JsdWU6IFwiXFx4MWJbMzRtXCIsXHJcbiAgRmdNYWdlbnRhOiBcIlxceDFiWzM1bVwiLFxyXG4gIEZnQ3lhbjogXCJcXHgxYlszNm1cIixcclxuICBGZ1doaXRlOiBcIlxceDFiWzM3bVwiLFxyXG4gIEJnQmxhY2s6IFwiXFx4MWJbNDBtXCIsXHJcbiAgQmdSZWQ6IFwiXFx4MWJbNDFtXCIsXHJcbiAgQmdHcmVlbjogXCJcXHgxYls0Mm1cIixcclxuICBCZ1llbGxvdzogXCJcXHgxYls0M21cIixcclxuICBCZ0JsdWU6IFwiXFx4MWJbNDRtXCIsXHJcbiAgQmdNYWdlbnRhOiBcIlxceDFiWzQ1bVwiLFxyXG4gIEJnQ3lhbjogXCJcXHgxYls0Nm1cIixcclxuICBCZ1doaXRlOiBcIlxceDFiWzQ3bVwiLFxyXG59IGFzIGNvbnN0O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFdlYiBEZXYgU3R1ZmZcXFxcY2hhb3Mtc2hvcHBlci1jaHJvbWUtZXh0ZW5zaW9uXFxcXHV0aWxzXFxcXG1hbmlmZXN0LXBhcnNlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcV2ViIERldiBTdHVmZlxcXFxjaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb25cXFxcdXRpbHNcXFxcbWFuaWZlc3QtcGFyc2VyXFxcXGluZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9XZWIlMjBEZXYlMjBTdHVmZi9jaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb24vdXRpbHMvbWFuaWZlc3QtcGFyc2VyL2luZGV4LnRzXCI7dHlwZSBNYW5pZmVzdCA9IGNocm9tZS5ydW50aW1lLk1hbmlmZXN0VjM7XHJcblxyXG5jbGFzcyBNYW5pZmVzdFBhcnNlciB7XHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBzdGF0aWMgY29udmVydE1hbmlmZXN0VG9TdHJpbmcobWFuaWZlc3Q6IE1hbmlmZXN0KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCwgbnVsbCwgMik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYW5pZmVzdFBhcnNlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXZWIgRGV2IFN0dWZmXFxcXGNoYW9zLXNob3BwZXItY2hyb21lLWV4dGVuc2lvblxcXFx1dGlsc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxXZWIgRGV2IFN0dWZmXFxcXGNoYW9zLXNob3BwZXItY2hyb21lLWV4dGVuc2lvblxcXFx1dGlsc1xcXFxwbHVnaW5zXFxcXGN1c3RvbS1keW5hbWljLWltcG9ydC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovV2ViJTIwRGV2JTIwU3R1ZmYvY2hhb3Mtc2hvcHBlci1jaHJvbWUtZXh0ZW5zaW9uL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3VzdG9tRHluYW1pY0ltcG9ydCgpOiBQbHVnaW5PcHRpb24ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImN1c3RvbS1keW5hbWljLWltcG9ydFwiLFxyXG4gICAgcmVuZGVyRHluYW1pY0ltcG9ydCgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsZWZ0OiBgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29uc3QgZHluYW1pY0ltcG9ydCA9IChwYXRoKSA9PiBpbXBvcnQocGF0aCk7XHJcbiAgICAgICAgICBkeW5hbWljSW1wb3J0KFxyXG4gICAgICAgICAgYCxcclxuICAgICAgICByaWdodDogXCIpfVwiLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9O1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcV2ViIERldiBTdHVmZlxcXFxjaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb25cXFxcdXRpbHNcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcV2ViIERldiBTdHVmZlxcXFxjaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb25cXFxcdXRpbHNcXFxccGx1Z2luc1xcXFxhZGQtaG1yLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9XZWIlMjBEZXYlMjBTdHVmZi9jaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb24vdXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzXCI7aW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIjtcclxuXHJcbmNvbnN0IERVTU1ZX0NPREUgPSBgZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXt9O2A7XHJcblxyXG5mdW5jdGlvbiBnZXRJbmplY3Rpb25Db2RlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiByZWFkRmlsZVN5bmMoXHJcbiAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwicmVsb2FkXCIsIFwiaW5qZWN0aW9uc1wiLCBmaWxlTmFtZSksXHJcbiAgICB7IGVuY29kaW5nOiBcInV0ZjhcIiB9XHJcbiAgKTtcclxufVxyXG5cclxudHlwZSBDb25maWcgPSB7XHJcbiAgYmFja2dyb3VuZD86IGJvb2xlYW47XHJcbiAgdmlldz86IGJvb2xlYW47XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRIbXIoY29uZmlnPzogQ29uZmlnKTogUGx1Z2luT3B0aW9uIHtcclxuICBjb25zdCB7IGJhY2tncm91bmQgPSBmYWxzZSwgdmlldyA9IHRydWUgfSA9IGNvbmZpZyB8fCB7fTtcclxuICBjb25zdCBpZEluQmFja2dyb3VuZFNjcmlwdCA9IFwidmlydHVhbDpyZWxvYWQtb24tdXBkYXRlLWluLWJhY2tncm91bmQtc2NyaXB0XCI7XHJcbiAgY29uc3QgaWRJblZpZXcgPSBcInZpcnR1YWw6cmVsb2FkLW9uLXVwZGF0ZS1pbi12aWV3XCI7XHJcblxyXG4gIGNvbnN0IHNjcmlwdEhtckNvZGUgPSBpc0RldiA/IGdldEluamVjdGlvbkNvZGUoXCJzY3JpcHQuanNcIikgOiBEVU1NWV9DT0RFO1xyXG4gIGNvbnN0IHZpZXdIbXJDb2RlID0gaXNEZXYgPyBnZXRJbmplY3Rpb25Db2RlKFwidmlldy5qc1wiKSA6IERVTU1ZX0NPREU7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImFkZC1obXJcIixcclxuICAgIHJlc29sdmVJZChpZCkge1xyXG4gICAgICBpZiAoaWQgPT09IGlkSW5CYWNrZ3JvdW5kU2NyaXB0IHx8IGlkID09PSBpZEluVmlldykge1xyXG4gICAgICAgIHJldHVybiBnZXRSZXNvbHZlZElkKGlkKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGxvYWQoaWQpIHtcclxuICAgICAgaWYgKGlkID09PSBnZXRSZXNvbHZlZElkKGlkSW5CYWNrZ3JvdW5kU2NyaXB0KSkge1xyXG4gICAgICAgIHJldHVybiBiYWNrZ3JvdW5kID8gc2NyaXB0SG1yQ29kZSA6IERVTU1ZX0NPREU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpZCA9PT0gZ2V0UmVzb2x2ZWRJZChpZEluVmlldykpIHtcclxuICAgICAgICByZXR1cm4gdmlldyA/IHZpZXdIbXJDb2RlIDogRFVNTVlfQ09ERTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSZXNvbHZlZElkKGlkOiBzdHJpbmcpIHtcclxuICByZXR1cm4gXCJcXDBcIiArIGlkO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcV2ViIERldiBTdHVmZlxcXFxjaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFdlYiBEZXYgU3R1ZmZcXFxcY2hhb3Mtc2hvcHBlci1jaHJvbWUtZXh0ZW5zaW9uXFxcXG1hbmlmZXN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9XZWIlMjBEZXYlMjBTdHVmZi9jaGFvcy1zaG9wcGVyLWNocm9tZS1leHRlbnNpb24vbWFuaWZlc3QudHNcIjtpbXBvcnQgcGFja2FnZUpzb24gZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XHJcblxyXG4vKipcclxuICogQWZ0ZXIgY2hhbmdpbmcsIHBsZWFzZSByZWxvYWQgdGhlIGV4dGVuc2lvbiBhdCBgY2hyb21lOi8vZXh0ZW5zaW9uc2BcclxuICovXHJcbmNvbnN0IG1hbmlmZXN0OiBjaHJvbWUucnVudGltZS5NYW5pZmVzdFYzID0ge1xyXG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXHJcbiAgbmFtZTogcGFja2FnZUpzb24ubmFtZSxcclxuICB2ZXJzaW9uOiBwYWNrYWdlSnNvbi52ZXJzaW9uLFxyXG4gIGRlc2NyaXB0aW9uOiBwYWNrYWdlSnNvbi5kZXNjcmlwdGlvbixcclxuICBvcHRpb25zX3BhZ2U6IFwic3JjL3BhZ2VzL29wdGlvbnMvaW5kZXguaHRtbFwiLFxyXG4gIGJhY2tncm91bmQ6IHtcclxuICAgIHNlcnZpY2Vfd29ya2VyOiBcInNyYy9wYWdlcy9iYWNrZ3JvdW5kL2luZGV4LmpzXCIsXHJcbiAgICB0eXBlOiBcIm1vZHVsZVwiLFxyXG4gIH0sXHJcbiAgYWN0aW9uOiB7XHJcbiAgICBkZWZhdWx0X3BvcHVwOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXHJcbiAgICBkZWZhdWx0X2ljb246IFwiaWNvbi0zNC5wbmdcIixcclxuICB9LFxyXG4gIC8vIGNocm9tZV91cmxfb3ZlcnJpZGVzOiB7XHJcbiAgLy8gICBuZXd0YWI6IFwic3JjL3BhZ2VzL25ld3RhYi9pbmRleC5odG1sXCIsXHJcbiAgLy8gfSxcclxuICAvLyBwZXJtaXNzaW9uczogW1xyXG4gICAgLy8gXCJ0YWJzXCIsXHJcbiAgICAvLyBcImFjdGl2ZVRhYlwiXHJcbiAgLy8gXSxcclxuICAvLyBob3N0X3Blcm1pc3Npb25zOiBbXHJcbiAgLy8gICBcImh0dHA6Ly8qLypcIixcclxuICAvLyAgIFwiaHR0cHM6Ly8qLypcIlxyXG4gIC8vIF0sXHJcbiAgaWNvbnM6IHtcclxuICAgIFwiMTI4XCI6IFwiaWNvbi0xMjgucG5nXCIsXHJcbiAgfSxcclxuICBjb250ZW50X3NjcmlwdHM6IFtcclxuICAgIHtcclxuICAgICAgLy8gbWF0Y2hlczogW1wiaHR0cDovLyovKlwiLCBcImh0dHBzOi8vKi8qXCIsIFwiPGFsbF91cmxzPlwiXSxcclxuICAgICAgXCJtYXRjaGVzXCI6IFsgXCIqOi8vKi8qXCIgXSxcclxuICAgICAgXCJpbmNsdWRlX2dsb2JzXCI6IFtcclxuICAgICAgICBcIio6Ly8qLmFtYXpvbi4qLypcIlxyXG4gICAgICBdLFxyXG4gICAgICBqczogW1wic3JjL3BhZ2VzL2NvbnRlbnQvaW5kZXguanNcIl0sXHJcbiAgICAgIC8vIEtFWSBmb3IgY2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICAgIGNzczogW1wiYXNzZXRzL2Nzcy9jb250ZW50U3R5bGU8S0VZPi5jaHVuay5jc3NcIl0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgZGV2dG9vbHNfcGFnZTogXCJzcmMvcGFnZXMvZGV2dG9vbHMvaW5kZXguaHRtbFwiLFxyXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xyXG4gICAge1xyXG4gICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICBcImFzc2V0cy9qcy8qLmpzXCIsXHJcbiAgICAgICAgXCJhc3NldHMvY3NzLyouY3NzXCIsXHJcbiAgICAgICAgXCJpY29uLTEyOC5wbmdcIixcclxuICAgICAgICBcImljb24tMzQucG5nXCIsXHJcbiAgICAgIF0sXHJcbiAgICAgIG1hdGNoZXM6IFtcIio6Ly8qLypcIl0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtYW5pZmVzdDtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VSxTQUFTLG9CQUFvQjtBQUN0VyxPQUFPLFdBQVc7QUFDbEIsT0FBT0EsU0FBUSxXQUFBQyxnQkFBZTs7O0FDRjZWLFlBQVksUUFBUTtBQUMvWSxZQUFZLFVBQVU7OztBQ0NQLFNBQVIsU0FBMEIsU0FBaUIsTUFBa0I7QUFDbEUsTUFBSSxRQUFnQixRQUFRLE9BQU87QUFFbkMsVUFBUSxNQUFNO0FBQUEsSUFDWixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxFQUNKO0FBRUEsVUFBUSxJQUFJLE9BQU8sT0FBTztBQUM1QjtBQUVBLElBQU0sU0FBUztBQUFBLEVBQ2IsT0FBTztBQUFBLEVBQ1AsUUFBUTtBQUFBLEVBQ1IsS0FBSztBQUFBLEVBQ0wsWUFBWTtBQUFBLEVBQ1osT0FBTztBQUFBLEVBQ1AsU0FBUztBQUFBLEVBQ1QsUUFBUTtBQUFBLEVBQ1IsU0FBUztBQUFBLEVBQ1QsT0FBTztBQUFBLEVBQ1AsU0FBUztBQUFBLEVBQ1QsVUFBVTtBQUFBLEVBQ1YsUUFBUTtBQUFBLEVBQ1IsV0FB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Q0EsT0FBTztBQUFBLFFBQ0wsU0FBUyxDQUFDLFVBQVUsZ0JBQWdCO0FBQUEsUUFDcEMsU0FBUyxDQUFDLG1CQUFtQixrQkFBa0I7QUFBQSxNQUNqRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCRyxTQUNaLHdCQUNBO0FBQUEsUUFDSixnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGdCQUFNLEVBQUUsS0FBSyxNQUFNLE1BQU0sSUFBSUMsTUFBSyxNQUFNLFVBQVUsSUFBSTtBQUN0RCxnQkFBTSxjQUFjLElBQUksTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ3hDLGdCQUFNLE9BQU8sY0FBYyxlQUFlLEtBQUs7QUFDL0MsY0FBSSxTQUFTLGdCQUFnQjtBQUMzQixtQkFBTywwQkFBMEI7QUFBQSxVQUNuQztBQUNBLGlCQUFPLGdCQUFnQjtBQUFBLFFBQ3pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUVELFNBQVMsZUFBZSxLQUFhO0FBQ25DLFFBQU0sZ0JBQWdCLElBQUksT0FBTyxjQUFjLEdBQUc7QUFDbEQsU0FBTyxJQUFJLFlBQVksRUFBRSxRQUFRLGVBQWUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDO0FBQ3hFO0FBRUEsSUFBSSx1QkFBK0IsWUFBWTtBQUMvQyxTQUFTLGlDQUFpQztBQUN4Qyx5QkFBdUIsWUFBWTtBQUNuQyxTQUFPO0FBQ1Q7QUFFQSxTQUFTLGNBQXNCO0FBQzdCLFNBQU8sSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLFFBQVE7QUFDdkM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAicmVzb2x2ZSIsICJtYW5pZmVzdCIsICJtYW5pZmVzdCIsICJtYWtlTWFuaWZlc3QiLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInB1YmxpY0RpciIsICJpc0RldiIsICJwYXRoIl0KfQo=
