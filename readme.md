# NoMagic.js

NoMagic.js is a lightweight, minimalistic state management and DOM manipulation library designed to simplify the creation of dynamic web applications. It provides a simple API for managing state and rendering UI components without the need for complex frameworks or additional dependencies.

## Features

- **State Management**: Easily manage and update state with the `useState` hook.
- **Reactive UI**: Automatically update the DOM when state changes.
- **Component Creation**: Create and compose HTML elements with the `CreateElement` function.
- **Lightweight**: Minimal overhead with no external dependencies.

## Installation

You can include NoMagic.js directly in your project by downloading the script or using a CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/nomagic.js/dist/nomagic.min.js"></script>
```

Alternatively, you can install it via npm:

```bash
npm install nomagic.js
```

## Usage

### Basic Example

Here's a simple example demonstrating how to use NoMagic.js to create a counter application:

```javascript
import { Root, CreateElement, useState } from 'nomagic.js';

function RootComponent() {
  const { get: useValue, set: setValue } = useState('0');

  return CreateElement(
    'div', {
    children: [
      CreateElement('div', {
        props: {
          textContent: useValue,
        },
      }),
      CreateElement('button', {
        props: {
          textContent: 'Increment',
          onclick: () => {
            setValue((parseInt(useValue()) + 1).toString());
          }
        },
      }),
    ]
  }
  )
}

const root = new Root(document.getElementById('app')!);
root.render([RootComponent()]);
```

### API Reference

#### `useState<T>(initialValue: T)`

Creates a stateful value and returns an object with `get` and `set` methods to read and update the state.

- **get(onChange?: OnChangeType<T>)**: Returns the current state value. Optionally, you can pass an `onChange` callback to be notified when the state changes.
- **set(newValue: T)**: Updates the state value and notifies all registered observers.

#### `CreateElement<T extends keyof HTMLElementTagNameMap>(tag: T, options: { props?: { [Prop in keyof HTMLElementTagNameMap[T]]?: HTMLElementTagNameMap[T][Prop] | ((onChange: OnChangeType<HTMLElementTagNameMap[T][Prop]>) => HTMLElementTagNameMap[T][Prop]) }, children?: HTMLElement[] })`

Creates an HTML element with the specified tag, properties, and children.

- **tag**: The HTML tag name (e.g., `'div'`, `'button'`).
- **props**: An object containing properties to be set on the element. Properties can be static values or functions that accept an `onChange` callback to update the property dynamically.
- **children**: An array of child elements to append to the created element.

#### `Root`

A class that represents the root container for rendering components.

- **constructor(rootElement: HTMLElement)**: Initializes a new `Root` instance with the specified root element.
- **render(children: HTMLElement[])**: Renders the provided children into the root element.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/jpc0/nomagic.js).

## License

NoMagic.js is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
