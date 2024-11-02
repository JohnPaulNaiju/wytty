import Constants from 'expo-constants';

const FIREBASE_API_KEY = Constants?.expoConfig?.extra?.FIREBASE_API_KEY;
const AUTH_DOMAIN = Constants?.expoConfig?.extra?.AUTH_DOMAIN;
const DATABASE_URL = Constants?.expoConfig?.extra?.DATABASE_URL;
const PROJECT_ID = Constants?.expoConfig?.extra?.PROJECT_ID;
const STORAGE_BUCKET = Constants?.expoConfig?.extra?.STORAGE_BUCKET;
const MESSAGING_SENDER_ID = Constants?.expoConfig?.extra?.MESSAGING_SENDER_ID;
const APP_ID = Constants?.expoConfig?.extra?.APP_ID;
const MEASUREMENT_ID = Constants?.expoConfig?.extra?.MEASUREMENT_ID;

export const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
};