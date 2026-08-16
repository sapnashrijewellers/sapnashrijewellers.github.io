function doGet(e) {
    
  let dataToReturn = {}; 

    dataToReturn = {
      products: getData('Products', 0, PRODUCT_RULES),            
      categories: getData('Categories', 0, CATEGORY_RULES),
      banners: getData('Banners', 0, BANNER_RULES),
      types: getData('Types', 0, TYPE_RULES),
      testimonials: getData('Testimonials', 0, TESTIMONIALS_RULES),
      queryMap: getMap("Query Map"),
      popularSearches: getData('PopularSearches', 0, TYPE_RULES),
      careInstructions: getData('Care', 0, TYPE_RULES),
      faqs: getData('FAQs',1,FAQ_RULES),
      rates: getMap("Rates", true),
    };  

  // 4. Stringify the result and set JSON MimeType
  const jsonOutput = JSON.stringify(dataToReturn);

  return ContentService.createTextOutput(jsonOutput)
    .setMimeType(ContentService.MimeType.JSON);
}