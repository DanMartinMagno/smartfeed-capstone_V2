// frontend/type/react-navigation-stack.d.ts

declare module "react-navigation-stack" {
  import {
    NavigationContainer,
    NavigationRouteConfigMap,
    NavigationScreenProp,
    NavigationRoute,
    NavigationStackScreenOptions,
  } from "react-navigation";

  export interface StackNavigatorConfig {
    initialRouteName?: string;
    navigationOptions?:
      | NavigationStackScreenOptions
      | ((navigationOptionsContainer: {
          navigation: NavigationScreenProp<NavigationRoute, any>;
        }) => NavigationStackScreenOptions);
    paths?: string;
    mode?: "card" | "modal";
    headerMode?: "screen" | "float" | "none";
    cardStyle?: any;
    onTransitionStart?: () => void;
    onTransitionEnd?: () => void;
  }

  export function createStackNavigator(
    routeConfigMap: NavigationRouteConfigMap,
    stackConfig?: StackNavigatorConfig
  ): NavigationContainer;
}
