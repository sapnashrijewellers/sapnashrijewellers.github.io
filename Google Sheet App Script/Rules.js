const PRODUCT_RULES = {
  'id': 'NUMBER',
  'ratingcount': 'NUMBER',
  'rating': 'NUMBER',
  'weight': 'NUMBER',
  'makingcharges': 'NUMBER',
  'display': 'NUMBER',
  'gst': 'NUMBER',
  'englishhighlights': 'ARRAY_NEWLINE',
  'highlights': 'ARRAY_NEWLINE',
  'images': 'ARRAY_IMAGES',
  'type': 'ARRAY_COMMA',
  'active': 'BOOLEAN',
  'newarrival': 'BOOLEAN',
  'available': 'BOOLEAN',
  'huid': 'BOOLEAN',
  'discount': 'NUMBER',
  'slug':'name'
};
const PV_RULES = {
  'id': 'NUMBER',
  'productid': 'NUMBER',  
  'weight': 'NUMBER',
  'makingcharges': 'NUMBER',
  'discount': 'NUMBER',
  'available': 'BOOLEAN',
  'priceadjustment': 'NUMBER',
  'active': 'BOOLEAN'
};

const TYPE_RULES = {
  'id':'NUMBER',
  'rank': 'NUMBER',
  'active': 'BOOLEAN',
  'slug':'type'
};
const BANNER_RULES = {
  'rank': 'NUMBER',
  'active': 'BOOLEAN'
};
const CATEGORY_RULES = {
  'id':'NUMBER',
  'rank': 'NUMBER',
  'active': 'BOOLEAN',
  'slug':'name'
};
const TESTIMONIALS_RULES = {
  'rating': 'NUMBER'
};
const Rate_RULES = {
  'rate': 'NUMBER'
};

const FAQ_RULES = {
  'productid': 'NUMBER'
}