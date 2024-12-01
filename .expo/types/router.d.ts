/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/profile` | `/(tabs)/social` | `/(tabs)/success` | `/_sitemap` | `/app.d` | `/config/firebase` | `/hooks/useAddPins` | `/modals/addSex` | `/others/favPlaces` | `/others/friends` | `/others/login` | `/profile` | `/social` | `/success`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
