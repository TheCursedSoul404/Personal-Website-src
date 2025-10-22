module.exports = function(eleventyConfig) {
  // Copy the entire style and script folders as-is
  eleventyConfig.addPassthroughCopy("style");
  eleventyConfig.addPassthroughCopy("script");

  // Optional: copy images or other assets if you have them
  // eleventyConfig.addPassthroughCopy("images");

  return {
    dir: {
      input: "Data Files for Flask/templates", // your source HTMLs
      output: "_site" // build output folder
    }
  };
};