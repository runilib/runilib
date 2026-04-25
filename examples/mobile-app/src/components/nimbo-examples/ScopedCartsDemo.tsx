import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { type CartProduct, cartStore } from './cartStore';

const SHOPS = [
  {
    id: 'nike',
    label: 'Nike',
    accent: '#0f172a',
    catalog: [
      { id: 'air-max', name: 'Air Max', price: 180 },
      { id: 'pegasus', name: 'Pegasus', price: 130 },
    ],
  },
  {
    id: 'apple',
    label: 'Apple',
    accent: '#1d4ed8',
    catalog: [
      { id: 'iphone', name: 'iPhone 16', price: 999 },
      { id: 'airpods', name: 'AirPods Pro', price: 249 },
    ],
  },
] as const;

export function ScopedCartsDemo() {
  return (
    <View style={{ gap: 14 }}>
      <Text style={s.intro}>
        One cartStore definition. Each shop calls cartStore.scope(shopId) and gets its own
        isolated state instance.
      </Text>
      {SHOPS.map((shop) => (
        <ShopCart
          key={shop.id}
          shopId={shop.id}
          label={shop.label}
          accent={shop.accent}
          catalog={shop.catalog as readonly CartProduct[]}
        />
      ))}
    </View>
  );
}

const ShopCart = ({
  shopId,
  label,
  accent,
  catalog,
}: {
  shopId: string;
  label: string;
  accent: string;
  catalog: readonly CartProduct[];
}) => {
  const scoped = cartStore.scope(shopId);

  const items = scoped.use((state) => state.items);
  const total = scoped.useSelector('total');
  const count = scoped.useSelector('count');
  const { add, remove, clear } = scoped.useActions();

  return (
    <View style={[s.card, { borderColor: `${accent}33` }]}>
      <View style={s.header}>
        <View>
          <Text style={[s.scopeLabel, { color: accent }]}>scope: {shopId}</Text>
          <Text style={s.shopName}>{label}</Text>
        </View>
        <View style={[s.countPill, { backgroundColor: `${accent}14` }]}>
          <Text style={[s.countPillText, { color: accent }]}>
            {count} item{count === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {catalog.map((product) => (
          <TouchableOpacity
            key={product.id}
            activeOpacity={0.85}
            onPress={() => add(product)}
            style={[s.addBtn, { borderColor: `${accent}33` }]}
          >
            <Text style={[s.addBtnText, { color: accent }]}>
              + {product.name} (${product.price})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ gap: 6, minHeight: 50 }}>
        {items.length === 0 ? (
          <Text style={s.empty}>Empty</Text>
        ) : (
          items.map((item) => (
            <View
              key={item.lineId}
              style={s.row}
            >
              <Text style={s.rowName}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={s.rowPrice}>${item.price}</Text>
                <TouchableOpacity
                  onPress={() => remove(item.lineId)}
                  hitSlop={8}
                >
                  <Text style={s.removeBtn}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={s.footer}>
        <Text style={s.totalText}>Total: ${total}</Text>
        <TouchableOpacity
          onPress={clear}
          disabled={items.length === 0}
        >
          <Text
            style={[s.clearText, { color: items.length === 0 ? '#cbd5e1' : '#b91c1c' }]}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  intro: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#fff',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scopeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  shopName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  empty: {
    color: '#94a3b8',
    fontSize: 13,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(15,23,42,0.04)',
  },
  rowName: {
    fontSize: 13,
    color: '#0f172a',
  },
  rowPrice: {
    color: '#64748b',
    fontSize: 13,
  },
  removeBtn: {
    color: '#b91c1c',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,42,0.06)',
  },
  totalText: {
    fontWeight: '800',
    color: '#0f172a',
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
