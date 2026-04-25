import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

/**
 * Register the main component.
 * The name must match the name in MainActivity.kt's getMainComponentName().
 */
AppRegistry.registerComponent(appName, () => App);
