export type Observer<T> = (newValue: T) => void;
export type OnChangeType<T> = ((updatedValue: T) => void);
export declare function useState<T>(input: T): {
    get: (onChange?: OnChangeType<T>) => T;
    set: (newValue: T) => void;
};
export declare function CreateElement<T extends keyof HTMLElementTagNameMap>(tag: T, { props, children }: {
    props?: {
        [Prop in keyof HTMLElementTagNameMap[T]]?: HTMLElementTagNameMap[T][Prop] | ((onChange: OnChangeType<HTMLElementTagNameMap[T][Prop]>) => HTMLElementTagNameMap[T][Prop]);
    };
    children?: HTMLElement[];
}): HTMLElementTagNameMap[T];
export declare class Root {
    private readonly rootElement;
    constructor(rootElement: HTMLElement);
    render(children: HTMLElement[]): void;
}
declare global {
    interface HTMLElement {
        __observers?: Set<Observer<any>>;
    }
}
