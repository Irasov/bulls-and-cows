type Child = Node | string;

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: readonly Child[]
): HTMLElementTagNameMap[K] => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

export const mount = (root: HTMLElement, ...children: readonly Child[]): void =>
  root.replaceChildren(...children);
