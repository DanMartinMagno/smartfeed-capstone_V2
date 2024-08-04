// frontend/type/shimmer.d.ts

declare module 'shimmer' {
  export function wrap(
    nodule: object,
    name: string,
    wrapper: (original: Function) => Function
  ): void;

  export function massWrap(
    nodules: object[],
    names: string[],
    wrapper: (original: Function) => Function
  ): void;

  export function unwrap(nodule: object, name: string): void;

  export function massUnwrap(nodules: object[], names: string[]): void;
}
