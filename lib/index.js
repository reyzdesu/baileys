"use strict";

const pkg = require("../package.json");

function printBanner() {
    const W = process.stdout.columns || 80;
    const version = `v${pkg.version || "0.0.10"}`;
    const reset   = "\x1b[0m";
    const bold    = "\x1b[1m";
    const dim     = "\x1b[2m";

    // colour helpers
    const rgb = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;
    const bgRgb = (r, g, b) => `\x1b[48;2;${r};${g};${b}m`;

    // gradient text painter (left → right)
    function gradText(text, r1, g1, b1, r2, g2, b2) {
        return text.split("").map((ch, i, a) => {
            const t = a.length > 1 ? i / (a.length - 1) : 0;
            const r = Math.round(r1 + (r2 - r1) * t);
            const g = Math.round(g1 + (g2 - g1) * t);
            const bv= Math.round(b1 + (b2 - b1) * t);
            return `${rgb(r, g, bv)}${ch}`;
        }).join("") + reset;
    }

    function center(str, rawLen) {
        const pad = Math.max(0, Math.floor((W - rawLen) / 2));
        return " ".repeat(pad) + str;
    }

    function line(char = "─", colour = rgb(60, 60, 80)) {
        return colour + char.repeat(W) + reset;
    }

    const tips = [
        "Use cachedGroupMetadata for faster group sends",
        "Enable markOnlineOnConnect: false to stay offline",
        "Set syncFullHistory: false to save RAM on startup",
        "Use generateHighQualityLinkPreview: true for rich previews",
        "Pass useCachedGroupMetadata: true in sendMessage options",
        "Keep retryRequestDelayMs low for faster retry on fail",
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];

    const lines = [];

    lines.push("");
    lines.push(line("─", rgb(30, 30, 50)));

    // ASCII LOGO — gradient cyan → purple
    const logoLines = [
        " ██████╗  █████╗ ██╗██╗     ███████╗██╗   ██╗███████╗",
        " ██╔══██╗██╔══██╗██║██║     ██╔════╝╚██╗ ██╔╝██╔════╝",
        " ██████╔╝███████║██║██║     █████╗   ╚████╔╝ ███████╗",
        " ██╔══██╗██╔══██║██║██║     ██╔══╝    ╚██╔╝  ╚════██║",
        " ██████╔╝██║  ██║██║███████╗███████╗   ██║   ███████║",
        " ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝   ╚═╝   ╚══════╝",
    ];

    const logoW = 55;
    logoLines.forEach((l, i) => {
        const t = i / (logoLines.length - 1);
        const r1 = 0,   g1 = 220, b1 = 255;
        const r2 = 170, g2 = 0,   b2 = 255;
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const bv= Math.round(b1 + (b2 - b1) * t);
        lines.push(center(rgb(r, g, bv) + bold + l + reset, logoW));
    });

    lines.push("");

    // Subtitle
    const subtitle = "Modified Baileys · WhatsApp Web API Library";
    lines.push(center(
        dim + rgb(160, 160, 200) + subtitle + reset,
        subtitle.length
    ));

    // Version badge
    const badge = ` ${version} `;
    lines.push(center(
        bgRgb(0, 180, 255) + rgb(0, 0, 0) + bold + badge + reset,
        badge.length
    ));

    lines.push("");
    lines.push(line("─", rgb(30, 30, 50)));

    // Feature list
    const features = [
        ["✦", "Button v9 native_flow  (interactive, list, nativeFlow)"],
        ["✦", "orderStatus & richMessage support"],
        ["✦", "Newsletter mediatype fix (interactive media)"],
        ["✦", "Smart send queue — no rate-limit crash"],
        ["✦", "Location thumbnail auto-resize via sharp"],
    ];

    lines.push("");
    features.forEach(([icon, desc]) => {
        const raw = `  ${icon}  ${desc}`;
        lines.push(
            "  " + gradText(icon, 0, 220, 180, 0, 120, 255) +
            "  " + rgb(200, 200, 220) + desc + reset
        );
    });

    lines.push("");
    lines.push(line("─", rgb(30, 30, 50)));

    // Tip
    const tipLabel = "TIP  ";
    const tipLine  = `  ${tipLabel}${tip}`;
    lines.push(
        "  " + bgRgb(255, 200, 0) + rgb(0, 0, 0) + bold + " TIP " + reset +
        "  " + rgb(200, 200, 160) + tip + reset
    );

    lines.push(line("─", rgb(30, 30, 50)));
    lines.push("");

    console.log(lines.join("\n"));
}

try { printBanner(); } catch (e) { /* silent fail on headless env */ }

// ─── Exports ───────────────────────────────────────────────────────────────
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              let desc = Object.getOwnPropertyDescriptor(m, k);
              if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = { enumerable: true, get: function () { return m[k]; } };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
const __exportStar =
    (this && this.__exportStar) ||
    function (m, exports) {
        for (var p in m) {
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) {
                __createBinding(exports, m, p);
            }
        }
    };

Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = exports.makeWASocket = null;

const { proto: proto } = require("../WAProto");
Object.defineProperty(exports, "proto", {
    enumerable: true,
    get: function () { return proto; },
});

const { default: socket } = require("./Socket");
exports.makeWASocket = socket;

__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

exports.default = socket;
