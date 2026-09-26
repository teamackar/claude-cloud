// Eleventy build. Liquid templates (the language Shopify uses) so the
// partials port across in phase two. Output is plain static HTML in _site/.
//
// Only src/ is read as templates, and only css/, js/ and asset files are
// copied, so palette.html, /art, /design (the .dc.html prototypes and their
// runtime) and assets/manifest.json never reach the output.

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  // Asset files only: assets/manifest.json is an internal planning file and
  // does not ship.
  eleventyConfig.addPassthroughCopy("assets/**/*.{webp,jpg,jpeg,png,svg,woff2,txt}");

  return {
    dir: {
      input: "src",
      includes: "../_includes",
      layouts: "../_layouts",
      data: "../_data",
      output: "_site",
    },
    templateFormats: ["liquid", "html", "md"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
}
