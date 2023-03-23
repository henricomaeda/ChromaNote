// Import the AsyncStorage module from the react-native library. 
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores the provided data with the given key in AsyncStorage.
 * If json is true, the data is stringified before being stored.
 *
 * @param {string} key - The key to use when storing the data.
 * @param {*} value - The data to store.
 * @param {boolean} [json=false] - Whether to stringify the data before storing it.
 */
export const storeData = async (key, value, json = false) => {
    try {
        const data = json ? JSON.stringify(value) : value;
        await AsyncStorage.setItem(key, data);
        console.log('Data stored successfully:', data);
    }
    catch (error) {
        console.log('Error storing data:', error);
    }
};

/**
 * Retrieves the data stored under the given key in AsyncStorage.
 * If json is true, the retrieved data is parsed as JSON.
 *
 * @param {string} key - The key of the data to retrieve.
 * @param {boolean} [json=false] - Whether to parse the retrieved data as JSON.
 * @returns {Promise<*>} - The retrieved data or null if no data is found.
 */
export const getData = async (key, json = false) => {
    try {
        const value = await AsyncStorage.getItem(key);
        const data = json ? JSON.parse(value) : value;
        if (value !== null && data) {
            console.log('Successfully retrieved data:', value);
            return data;
        }
        else console.error('No data found:', key);
    }
    catch (error) {
        console.error('Error retrieving data:', error);
    }
};

/**
 * Removes the data stored under the given key from AsyncStorage.
 * @param {string} key - The key of the data to remove.
 */
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log('Data removed successfully:', key);
    }
    catch (error) {
        console.error('Error removing data:', error);
    }
};
