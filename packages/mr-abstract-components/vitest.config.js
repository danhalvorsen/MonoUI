"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var path_1 = require("path");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: "node",
        setupFiles: [path_1.default.resolve(__dirname, "./src/bootstrap.ts")], // auto-load DI bootstrap
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: [
            { find: /^src$/, replacement: path_1.default.resolve(__dirname, "./src/index.ts") },
            { find: /^src\//, replacement: path_1.default.resolve(__dirname, "./src/") + "/" },
        ],
    }
});
