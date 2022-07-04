export const RESTAURANT = 'Restaurant';

export const RestaurantSchema = {
  name: RESTAURANT,
  primaryKey: 'id',
  properties: {
    id: 'string',
    reviews: 'string?',
    location: 'string?',
    phone: 'string?',
    average_cost: 'string?',
    image: 'string?',
    restaurant_type: 'string?',
    business_name: 'string?',
    address: 'string?'
  },
};