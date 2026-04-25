import { createStore } from '@runilib/nimbo';

export type CartProduct = {
  id: string;
  name: string;
  price: number;
};

export type CartLine = CartProduct & {
  lineId: string;
};

let lineCounter = 0;

export const cartStore = createStore('demo:cart', {
  state: () => ({
    items: [] as CartLine[],
  }),
  actions: ({ patch }) => ({
    add(product: CartProduct) {
      lineCounter += 1;
      const line: CartLine = { ...product, lineId: `line-${lineCounter}` };
      patch((state) => ({ items: [...state.items, line] }));
    },
    remove(lineId: string) {
      patch((state) => ({
        items: state.items.filter((item) => item.lineId !== lineId),
      }));
    },
    clear() {
      patch({ items: [] });
    },
  }),
  selectors: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price, 0),
    count: (state) => state.items.length,
  },
});
