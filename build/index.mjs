export function useState(input) {
    let observers = new Set();
    let value = input;
    const registry = new FinalizationRegistry((heldValue) => {
        observers.delete(heldValue);
    });
    const get = (onChange) => {
        if (onChange) {
            const weakRef = new WeakRef(onChange);
            observers.add(weakRef);
            registry.register(onChange, weakRef);
        }
        return value;
    };
    const set = (newValue) => {
        if (value === newValue)
            return;
        value = newValue;
        observers.forEach(weakRef => {
            const observer = weakRef.deref();
            if (observer) {
                observer(newValue);
            }
            else {
                observers.delete(weakRef);
            }
        });
    };
    return {
        get,
        set,
    };
}
export function CreateElement(tag, { props, children = [] }) {
    const element = document.createElement(tag);
    element.__observers = new Set();
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            const value = props[key];
            if (typeof value === "function") {
                if (key.startsWith("on")) {
                    element[key] = value;
                }
                else {
                    const onChange = (updatedValue) => {
                        element[key] = updatedValue;
                    };
                    element.__observers.add(onChange);
                    element[key] = value(onChange);
                }
            }
            else {
                element[key] = value;
            }
        }
    }
    element.append(...children);
    return element;
}
export class Root {
    rootElement;
    constructor(rootElement) {
        this.rootElement = rootElement;
    }
    render(children) {
        this.rootElement.append(...children);
    }
}
