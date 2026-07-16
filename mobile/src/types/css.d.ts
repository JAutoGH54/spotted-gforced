// Type declarations for stylesheets to support CSS Modules and side-effect imports in React Native/Expo Web setups
declare module '*.css' {
  const content: { [className: string]: string } | any;
  export default content;
}
