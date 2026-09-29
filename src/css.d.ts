// Stylesheets are imported for their side effect only; Gatsby's webpack
// config handles them. Without this, TypeScript 7 rejects the import.
declare module "*.css" {
  const content: { [className: string]: string }
  export default content
}
