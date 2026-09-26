// Eleventy build. Liquid templates (the language Shopify uses) so the
// partials port across in phase two. Output is plain static HTML in _site/.
//
// Only src/ is read as templates, and only css/, js/ and assets/ are copied,
// so palette.html, /art, /design and the .dc.html prototypes never reach
// the output.

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");

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
