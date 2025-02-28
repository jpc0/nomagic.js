export type Observer<T> = (newValue: T) => void;

export type OnChangeType<T> = ((updatedValue: T) => void);
export function useState<T>(input: T) {
  let observers: Set<WeakRef<Observer<T>>> = new Set();
  let value = input;

  const registry = new FinalizationRegistry<WeakRef<Observer<T>>>((heldValue) => {
    observers.delete(heldValue);
  });


  const get = (onChange?: OnChangeType<T>) => {
    if (onChange) {
      const weakRef = new WeakRef(onChange);
      observers.add(weakRef);
      registry.register(onChange, weakRef);
    }
    return value;
  }
  const set = (newValue: T) => {
    if (value === newValue) return;
    value = newValue;
    observers.forEach(weakRef => {
      const observer = weakRef.deref();
      if (observer) {
        observer(newValue);
      } else {
        observers.delete(weakRef);
      }
    });
  }
  return {
    get,
    set,
  };
}

export function CreateElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  { props, children = [] }: {
    props?: {
      [Prop in keyof HTMLElementTagNameMap[T]]?: HTMLElementTagNameMap[T][Prop] |
      ((onChange: OnChangeType<HTMLElementTagNameMap[T][Prop]>) => HTMLElementTagNameMap[T][Prop]);
    },
    children?: HTMLElement[]
  }) {
  const element = document.createElement(tag);
  element.__observers = new Set();
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const value = props[key];
      type ValueType = HTMLElementTagNameMap[T][typeof key];
      if (typeof value === "function") {
        if (key.startsWith("on")) {
          element[key] = value as ValueType;
        } else {
          const onChange = (updatedValue: ValueType) => {
            element[key] = updatedValue;
          }
          element.__observers.add(onChange);
          element[key] = value(onChange);
        }
      } else {
        element[key] = value as ValueType;
      }
    }
  }
  element.append(...children);
  return element;
}

export class Root {
  private readonly rootElement: HTMLElement;
  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
  }

  render(children: HTMLElement[]) {
    this.rootElement.append(...children);
  }
}
// Extend HTMLElement to include the custom property
declare global {
  interface HTMLElement {
    __observers?: Set<Observer<any>>;
  }
}
