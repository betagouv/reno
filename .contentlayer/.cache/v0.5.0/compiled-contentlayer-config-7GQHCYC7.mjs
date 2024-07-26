// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

// mdxOptions.mjs
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
var mdxOptions = {
  remarkPlugins: [
    [
      remarkGfm,
      remarkToc,
      { heading: "(table[ -]of[ -])?contents?|toc|Sommaire" }
    ]
  ],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behaviour: "append",
        properties: {
          ariaHidden: true,
          tabIndex: -1,
          className: "hash-link"
        }
      }
    ]
  ]
};
var mdxOptions_default = mdxOptions;

// contentlayer.config.ts
var Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    titre: { type: "markdown", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true },
    image: { type: "string", required: false }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${post._raw.flattenedPath}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "articles",
  documentTypes: [Article],
  mdx: mdxOptions_default
});
export {
  Article,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-7GQHCYC7.mjs.map
