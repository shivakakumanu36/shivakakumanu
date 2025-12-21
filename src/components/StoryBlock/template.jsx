export const StoryBlockTemplate = {
  name: "story",
  label: "Story",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "image",
      label: "Image",
      type: "image",
    },
    {
      name: "altText",
      label: "Alt Text",
      type: "string",
    },
    {
      name: "paragraphs",
      label: "Paragraphs",
      type: "string",
      list: true,
      ui: {
        component: "textarea",
      },
    },
  ],
};
