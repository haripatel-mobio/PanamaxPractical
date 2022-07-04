import { GOOGLE_API_KEY } from "../../screens/BaseScreen";

const BASE_URL = 'https://foodbukka.herokuapp.com/api/';

export default {
  RESTAURANT_LIST: `${BASE_URL}v1/restaurant?page=1`,
  GET_COORDINATE: `https://maps.googleapis.com/maps/api/geocode/json?address=[address]&key=${GOOGLE_API_KEY}`
}