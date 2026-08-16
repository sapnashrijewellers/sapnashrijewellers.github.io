const PRODUCT_RULES = {
  'id': 'NUMBER',
  'ratingcount': 'NUMBER',
  'rating': 'NUMBER',
  'weight': 'NUMBER',
  'makingcharges': 'NUMBER',
  'display': 'NUMBER',
  'gst': 'NUMBER',  
  'highlights': 'ARRAY_NEWLINE',
  'images': 'ARRAY_IMAGES',
  'type': 'ARRAY_COMMA',
  'active': 'BOOLEAN',
  'newarrival': 'BOOLEAN',
  'available': 'BOOLEAN',
  'huid': 'BOOLEAN',
  'discount': 'NUMBER'

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
  'rank': 'NUMBER',
  'active': 'BOOLEAN'
};
const BANNER_RULES = {
  'rank': 'NUMBER',
  'active': 'BOOLEAN'
};
const CATEGORY_RULES = {
  'rank': 'NUMBER',
  'active': 'BOOLEAN'
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