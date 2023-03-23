// Import the StyleSheet module from React Native
import { StyleSheet } from 'react-native';

// Define a styles object using StyleSheet.create
const globalStyles = StyleSheet.create({
    floatContainer: {
        bottom: global.windowWidth / 20,
        right: global.windowWidth / 20,
        position: 'absolute',
    },
    floatButton: {
        marginTop: global.windowWidth / 42,
        backgroundColor: global.tintColor,
        borderRadius: global.circleRadius,
        height: global.windowWidth / 8.2,
        width: global.windowWidth / 8.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// Export the globalStyles object
export default globalStyles;
