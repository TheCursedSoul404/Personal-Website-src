module.exports = function(eleventyConfig) {
  // Copy static assets directly into the output folder
  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/script");

  return {
    dir: {
      input: "src",   // source folder
      output: "_site" // build folder — published root
    }
  };
};