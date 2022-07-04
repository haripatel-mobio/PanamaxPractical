import Realm from 'realm';
import { isValueNull } from '../../screens/BaseScreen';
import {RestaurantSchema} from './schema/SchemaRestaurants';
let schemaVersion = 1; // ! NOTE: increment by 1 if you changes in any schema (table)

class RealmHelper {
  static mRealmHelper = null;
  realm = new Realm();

  static getInstance() {
    if (!this.mRealmHelper) {
      this.mRealmHelper = new RealmHelper();
      return this.mRealmHelper;
    } else {
      return this.mRealmHelper;
    }
  }

  // create new schema
  async createSchema() {
    if (this.realm != null) {
      this.realm.close();
    }

    try {
      this.realm = await Realm.open({
        path: 'PanamaxPractical.realm',
        schema: [RestaurantSchema],
        schemaVersion: schemaVersion,
      });
    } catch (e) {
      console.log(`realm.path: in createSchema Exception`, e);
    }

    if (this.realm != null) {
      console.log(`realm.path: ${this.realm.path}`);
    }
  }

  // Get realm DB instance
  getRealmInstance() {
    if (this.realm != null) return this.realm;
    else return null;
  }

  insertMultipleSchemaData = (schema, valuesList, response) => {
    try {
      if (Array.isArray(valuesList)) {
        for (let i = 0; i < valuesList.length; i++) {
          const values = valuesList[i];
          let valueObj = {
            id: values.id,
            reviews: `${values.reviews}`,
            location: `${values.location}`,
            phone: `${values.phone}`,
            average_cost: `${values.averagecost}`,
            image: `${values.image}`,
            restaurant_type: `${values.restauranttype}`,
            business_name: `${values.businessname}`,
            address: `${values.address}`
          }
          this.insertSingleSchemaData(schema, valueObj)
        }
        if (!isValueNull(response)) {
          return response(true, null)
        }
      } else {
        console.log('Exception : object type is invalid');
        return response(false, 'object type is invalid')
      }
    } catch (error) {
      // return response(false, 'Something went wrong. Please try again.')
      console.log('Exception : insert >>> ' + error);
      this.getRealmInstance().close()
    }
  };

  insertSingleSchemaData = (schema, valueObj, response) => {
    try {
      this.getRealmInstance().write(() => {
        this.getRealmInstance().create(schema, valueObj);
      });
      if (!isValueNull(response)) {
        return response(true, null)
      }
    } catch (e) {
      console.log('Exception : insert >>> ' + e);
      this.getRealmInstance().close()
      if (!isValueNull(response)) {
        return response(false, e)
      }
    }
  }

  getAllObject(schema, startIndex, endIndex) {
    console.log(`startIndex: ${startIndex}`)
    console.log(`endIndex: ${endIndex}`)
    return this.getRealmInstance().objects(schema).slice(startIndex, endIndex);
  }

  getAllObjectsCount(schema) {
    return this.getRealmInstance().objects(schema).length;
  }

  getSingleRecord(schema, primaryField, primaryFieldValue) {
    let obj = this.getRealmInstance()
      .objects(schema)
      .filtered(`${primaryField} = ${primaryFieldValue}`);

    if (obj != null && obj.length === 1) {
      return obj;
    } else {
      return false;
    }
  }

  deleteAllRecordsOfSchema(schema) {
    try {
      this.getRealmInstance().write(() => {
        this.getRealmInstance().delete(this.getRealmInstance().objects(schema));
        return true;
      });
    } catch (e) {
      console.log(
        'Exception: deleteAllRecordsOfSchema.delete multiple recode >> ' + e,
      );
    }
  }
}

export default RealmHelper;
