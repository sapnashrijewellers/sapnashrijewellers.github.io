import MiniSearch from "minisearch";

export const miniSearchOptions: MiniSearch.Options = {
  fields: [
    "name",
    "highlights",
    "englishHighlights",
    "category",
    "keywords",
    "metaDescription",
    "type",
    "for",
    "purity"
  ],

  storeFields: [
    "id",
    "slug",
    "images",
    "category",
    "purity",
    "newArrival",
    "weight",
    "for",
    "type"
  ],

  tokenize(text) {
    return (
      text
        ?.normalize("NFC")
        .toLowerCase()
        .match(/[0-9a-zA-Z\u0900-\u097F]+/gu) || []
    );
  },

  processTerm(term) {
    if (!term) return "";
    return term
      .normalize("NFKC")
      .toLowerCase()
      .replace(/\u093C/g, "")
      .trim();
  }
};
