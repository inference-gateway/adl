import { defineConfig } from "vitepress";

// VitePress configuration for the ADL documentation site.
//
// The site is published at https://adl.inference-gateway.com/ via GitHub Pages.
export default defineConfig({
  base: "/",
  lang: "en-US",
  title: "ADL",
  titleTemplate: ":title - Agent Definition Language",
  srcExclude: ["README.md"],
  description:
    'Agent Definition Language (ADL): a vendor-neutral, declarative specification for AI agents. Think of ADL as "OpenAPI for AI Agents".',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://adl.inference-gateway.com/",
  },
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/adl-icon.svg" }],
    ["link", { rel: "icon", type: "image/x-icon", href: "/adl-favicon.ico" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
    ["meta", { name: "theme-color", content: "#3c8772" }],
    [
      "meta",
      { property: "og:title", content: "Agent Definition Language (ADL)" },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "A declarative, vendor-neutral specification for AI agents - OpenAPI for AI agents.",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      { property: "og:url", content: "https://adl.inference-gateway.com/" },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://adl.inference-gateway.com/logo.png",
      },
    ],
    ["meta", { property: "og:image:width", content: "1672" }],
    ["meta", { property: "og:image:height", content: "941" }],
    [
      "meta",
      {
        property: "og:image:alt",
        content: "Agent Definition Language (ADL) logo",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    [
      "meta",
      {
        name: "twitter:title",
        content: "Agent Definition Language (ADL)",
      },
    ],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "A declarative, vendor-neutral specification for AI agents - OpenAPI for AI agents.",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://adl.inference-gateway.com/logo.png",
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/introduction", activeMatch: "/guide/" },
      { text: "Reference", link: "/reference/", activeMatch: "/reference/" },
      { text: "Examples", link: "/examples/", activeMatch: "/examples/" },
      {
        text: "v1",
        link: "/v1/",
        activeMatch: "^/v1/",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "What is ADL?", link: "/guide/introduction" },
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Tools vs Skills", link: "/guide/tools-vs-skills" },
            { text: "Versioning", link: "/guide/versioning" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Top-level",
          items: [
            { text: "Overview", link: "/reference/" },
            { text: "apiVersion / kind", link: "/reference/api-version-kind" },
            { text: "metadata", link: "/reference/metadata" },
            { text: "spec", link: "/reference/spec" },
          ],
        },
        {
          text: "spec.*",
          items: [
            { text: "capabilities", link: "/reference/capabilities" },
            { text: "card", link: "/reference/card" },
            { text: "agent", link: "/reference/agent" },
            { text: "config", link: "/reference/config" },
            { text: "services", link: "/reference/services" },
            { text: "acronyms", link: "/reference/acronyms" },
            { text: "tools", link: "/reference/tools" },
            { text: "skills", link: "/reference/skills" },
            { text: "server", link: "/reference/server" },
            { text: "language", link: "/reference/language" },
            { text: "artifacts", link: "/reference/artifacts" },
            { text: "hooks", link: "/reference/hooks" },
            { text: "scm", link: "/reference/scm" },
            { text: "development", link: "/reference/development" },
            { text: "deployment", link: "/reference/deployment" },
          ],
        },
        {
          text: "Appendix",
          items: [
            {
              text: "License identifiers",
              link: "/reference/license-identifiers",
            },
          ],
        },
      ],
      "/examples/": [
        {
          text: "Examples",
          items: [
            { text: "Overview", link: "/examples/" },
            { text: "Minimal Agent", link: "/examples/minimal" },
            { text: "A2A Agent Without an LLM", link: "/examples/no-llm" },
            {
              text: "Services & Injection",
              link: "/examples/services-injection",
            },
            { text: "MCP-Connected Agent", link: "/examples/mcp" },
            {
              text: "Registry Skills & Bare Skills",
              link: "/examples/skills-registry",
            },
            { text: "Deployment Targets", link: "/examples/deployment" },
            {
              text: "Customer Support Agent",
              link: "/examples/customer-support",
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/inference-gateway/adl" },
    ],
    editLink: {
      pattern: "https://github.com/inference-gateway/adl/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message:
        'Released under the <a href="https://github.com/inference-gateway/adl/blob/main/LICENSE">Apache 2.0 License</a>.',
      copyright:
        'Copyright © 2025 - <a href="https://github.com/inference-gateway">Inference Gateway</a>',
    },
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3],
      label: "On this page",
    },
  },
});
