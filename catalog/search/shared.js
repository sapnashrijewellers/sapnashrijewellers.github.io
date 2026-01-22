"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.miniSearchQueryOptions = exports.miniSearchIndexOptions = void 0;
exports.miniSearchIndexOptions = {
    fields: [
        "name",
        "hindiName",
        "highlights",
        "englishHighlights",
        "category",
        "description",
        "type",
        "for",
        "purity"
    ],
    storeFields: [
        "id",
        "slug",
        "name",
        "hindiName",
        "images",
        "category",
        "purity",
        "newArrival",
        "weight",
        "for",
        "type",
        "rating",
        "ratingCount",
        "discount"
    ],
    tokenize(text) {
        return (text
            ?.normalize("NFC")
            .toLowerCase()
            .match(/[0-9a-zA-Z\u0900-\u097F]+/gu) || []);
    },
    processTerm: normalizeTerm
};
/* ---------------------------------------
   SEARCH options (used ONLY in .search)
--------------------------------------- */
exports.miniSearchQueryOptions = {
    fuzzy: 0.2,
    prefix: true,
    combineWith: "OR",
    boost: {
        name: 5,
        highlights: 3.5,
        hindiName: 3.5,
        englishHighlights: 3,
        category: 2.5,
        description: 2,
        type: 1.3,
        for: 1.2,
        purity: 1.1
    },
};
function normalizeTerm(term) {
    if (!term)
        return '';
    let t = term.normalize('NFKC').toLowerCase().trim();
    t = t.replace(/\u093C/g, ''); // nukta removal
    const map = {
        bangles: 'bangle',
        bracelets: 'bracelet',
        chains: 'chain',
        rings: 'ring',
        earrings: 'earring',
        pendants: 'pendant',
        necklaces: 'necklace',
        haar: 'necklace',
        anklets: 'anklet',
        chudiya: 'bangle',
        chudi: 'bangle',
        chudiyao: 'bangle',
        'चूड़ियाँ': 'चूड़ी',
        'चूड़ियों': 'चूड़ी',
        'अंगूठियाँ': 'अंगूठी',
        'अंगूठियों': 'अंगूठी',
        'बिछियाँ': 'बिछिया',
        'बिछियों': 'बिछिया'
    };
    if (map[t])
        return map[t];
    if (/^[a-z]+$/.test(t)) {
        if (t.endsWith('ies') && t.length > 4)
            return t.slice(0, -3) + 'y';
        if (t.endsWith('es') && t.length > 4)
            return t.slice(0, -2);
        if (t.endsWith('s') && t.length > 3)
            return t.slice(0, -1);
    }
    return t;
}
const normalize = (s = '') => s
    .toString()
    .normalize('NFC')
    .toLowerCase()
    //.replace(/[^0-9a-zA-Z\u0900-\u097F]+/gu, ' ')
    .trim();
exports.normalize = normalize;
