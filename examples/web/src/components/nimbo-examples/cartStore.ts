import { computed, createStore } from '@runilib/nimbo';

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  category: 'shoes' | 'accessories' | 'devices' | 'audio';
};

export type CartLine = CartProduct & {
  lineId: string;
};

type CartState = {
  items: CartLine[];
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
    totalByCategory: (state, category: CartProduct['category']) =>
      state.items
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.price, 0),
    discountedTotal: computed<CartState, [discountRate: number], number>(
      (state, discountRate) => {
        const total = state.items.reduce((sum, item) => sum + item.price, 0);

        return Math.round(total * (1 - discountRate));
      },
    ),
  },
});
