import { createStore } from '@runilib/nimbo';

export const userStore = createStore('demo:user', {
  state: () => ({
    name: 'Alice',
    loggedIn: true,
  }),
  actions: ({ patch }) => ({
    setName(name: string) {
      patch({ name });
    },
    toggle() {
      patch((state) => ({ loggedIn: !state.loggedIn }));
    },
  }),
});
