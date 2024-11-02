import 'dotenv/config';

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
const DATABASE_URL = process.env.DATABASE_URL;
const PROJECT_ID = process.env.PROJECT_ID;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID;
const APP_ID = process.env.APP_ID;
const MEASUREMENT_ID = process.env.MEASUREMENT_ID;
const PEXEL_API_KEY = process.env.PEXEL_API_KEY;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_SERVICES_JSON = process.env.GOOGLE_SERVICES_JSON;
const GOOGLE_SERVICES_INFO = process.env.GOOGLE_SERVICES_INFO;

export default {
    expo: {
        name: "Wytty",
        slug: "wytty",
        scheme: "wytty",
        version: "1.0.23", //increment by 0.0.1 in every release
        runtimeVersion: {
            policy: "sdkVersion"
        },
        orientation: "portrait",
        userInterfaceStyle: "dark",
        platforms: [
            "ios",
            "android"
        ],
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#0F0F0F"
        },
        notification: {
            icon: "./assets/notification.png",
            androidMode: "collapse",
            androidCollapsedTitle: "Wytty",
            color: "#FFFFFF"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            icon: "./assets/icon.png",
            bundleIdentifier: "com.aixinc.wytty",
            buildNumber: "16", //increment in every ios release
            backgroundColor: "#0F0F0F",
            supportsTablet: false,
            googleServicesFile: GOOGLE_SERVICES_INFO,
            config: {
                "usesNonExemptEncryption": false
            },
            entitlements: {
                "com.apple.developer.networking.wifi-info": true
            },
            associatedDomains: ["applinks:wytty.org"],
            infoPlist: {
                NSCameraUsageDescription: "Allow Wytty to access your camera to click photos and share it within your community or your connections. Your content will be visible to others unless you want to.",
            },
        },
        android: {
            package: "com.aixinc.wytty",
            backgroundColor: "#0F0F0F",
            versionCode: 23, //increment in every android release
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#0F0F0F"
            },
            googleServicesFile: GOOGLE_SERVICES_JSON,
            permissions: [
                "android.permission.RECORD_AUDIO",
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.FOREGROUND_SERVICE"
            ],
            intentFilters: [
                {
                    action: "VIEW",
                    autoVerify: true,
                    data: [
                        {
                            scheme: "https",
                            host: "wytty.org",
                            pathPrefix: "/"
                        },
                        {
                            scheme: "http",
                            host: "wytty.org",
                            pathPrefix: "/"
                        }
                    ],
                    category: ["BROWSABLE", "DEFAULT"]
                }
            ]
        },
        plugins: [
            [
                "expo-document-picker",
                {
                    iCloudContainerEnvironment: "Production"
                }
            ],
            [
                "expo-notifications",
                {
                    icon: "./assets/notification.png",
                    color: "#FFFFFF"
                }
            ],
            [
                "expo-build-properties",
                {
                    android: {
                        compileSdkVersion: 33,
                        targetSdkVersion: 33,
                        buildToolsVersion: "33.0.0",
                        enableProguardInReleaseBuilds: true,
                        enableShrinkResourcesInReleaseBuilds: true,
                        extraProguardRules: "-keep public class com.horcrux.svg.** {*;}",
                        allowBackup: false,
                    },
                    ios: {
                        deploymentTarget: "13.0",
                        useFrameworks: "static"
                    }
                }
            ],
            [
                "expo-media-library",
                {
                    photosPermission: "Allow Wytty to access your gallery to set profile pictures or share media within your community or your connections. Your content will be visible to others unless you want to.",
                    savePhotosPermission: "Allow Wytty to save photos to your device.",
                    isAccessMediaLocationEnabled: false
                }
            ],
        ],
        extra: {
            eas: {
                projectId: "29a4dd28-4a99-4467-9425-83b6438d2320"
            },
            FIREBASE_API_KEY: FIREBASE_API_KEY,
            AUTH_DOMAIN: AUTH_DOMAIN,
            DATABASE_URL: DATABASE_URL,
            PROJECT_ID: PROJECT_ID,
            STORAGE_BUCKET: STORAGE_BUCKET,
            MESSAGING_SENDER_ID: MESSAGING_SENDER_ID,
            APP_ID: APP_ID,
            MEASUREMENT_ID: MEASUREMENT_ID,
            PEXEL_API_KEY: PEXEL_API_KEY,
            GIPHY_API_KEY: GIPHY_API_KEY,
            OPENAI_API_KEY: OPENAI_API_KEY,
        },
        owner: "aixinc"
    }
};