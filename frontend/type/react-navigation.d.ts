// frontend/type/react-navigation.d.ts

declare module 'react-navigation' {
    import * as React from 'react';
  
    export interface NavigationParams {
      [key: string]: any;
    }
  
    export interface NavigationState {
      key: string;
      routeName: string;
      params?: NavigationParams;
      index?: number;
      routes?: NavigationRoute[];
    }
  
    export interface NavigationRoute {
      key: string;
      routeName: string;
      params?: NavigationParams;
    }
  
    export interface NavigationScreenProp<S extends NavigationState, P> {
      state: S;
      navigate(routeName: string, params?: P, action?: any): void;
      goBack(key?: string): void;
      // ... add more methods as needed
    }
  
    export interface NavigationContainerProps {
      uriPrefix?: string | RegExp;
      onNavigationStateChange?: (
        prevState: NavigationState,
        newState: NavigationState,
        action: any
      ) => void;
    }
  
    export class NavigationContainer extends React.Component<NavigationContainerProps> {}
  
    export interface NavigationRouteConfigMap {
      [key: string]: any;
    }
  
    export interface NavigationStackScreenOptions {}
    export interface NavigationDrawerScreenOptions {}
    export interface NavigationTabScreenOptions {}
    export interface NavigationSwitchScreenOptions {}
  
    export function createAppContainer(
      component: React.ComponentType
    ): React.ComponentType;
  
    export function createDrawerNavigator(
      routeConfigMap: NavigationRouteConfigMap,
      drawerConfig?: object
    ): NavigationContainer;
  
    export function createStackNavigator(
      routeConfigMap: NavigationRouteConfigMap,
      stackConfig?: object
    ): NavigationContainer;
  
    export function createBottomTabNavigator(
      routeConfigMap: NavigationRouteConfigMap,
      tabConfig?: object
    ): NavigationContainer;
  
    export function createMaterialTopTabNavigator(
      routeConfigMap: NavigationRouteConfigMap,
      tabConfig?: object
    ): NavigationContainer;
  
    export function createSwitchNavigator(
      routeConfigMap: NavigationRouteConfigMap,
      switchConfig?: object
    ): NavigationContainer;
  }
  