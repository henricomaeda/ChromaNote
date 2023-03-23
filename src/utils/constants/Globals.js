// Import necessary components
import { name as appName } from '../../../app.json';
import { Dimensions } from 'react-native';

// Set global variables
// Set the window's height and width
global.windowHeight = Dimensions.get('window').height;
global.windowWidth = Dimensions.get('window').width;

// Set the border radius value to be exactly like an circle
global.circleRadius = Math.round(global.windowWidth + global.windowHeight) / 2

// Set the main's app name
global.appName = appName;

// Set the background color to a dark blue-gray
global.backgroundColor = '#1e1d2b';

// Set the foreground color to a lighter shade of blue-gray
global.foregroundColor = '#272636';

// Define a gradient that transitions from blue-gray to a bright purple color
global.gradientColor = ['#272636', '#8f39c0'];

// Set a deep shade color, which can be used throughout the application
global.deepShadeColor = '#4b4a5a';

// Set a dark gray color for shading or accenting interface elements
global.shadeColor = '#696878';

// Set a light gray color for use as a tint or highlight
global.tintColor = '#fbfbfb';

// Define a bright purple color for highlighting or emphasizing important elements in the UI
global.highlightColor = '#6f6fc8';
