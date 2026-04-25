import { type CartProduct, cartStore } from './cartStore';

const SHOPS = [
  {
    id: 'nike',
    label: 'Nike',
    accent: '#0f172a',
    catalog: [
      { id: 'air-max', name: 'Air Max', price: 180, category: 'shoes' },
      { id: 'pegasus', name: 'Pegasus', price: 130, category: 'shoes' },
    ],
  },
  {
    id: 'apple',
    label: 'Apple',
    accent: '#1d4ed8',
    catalog: [
      { id: 'iphone', name: 'iPhone 16', price: 999, category: 'devices' },
      { id: 'airpods', name: 'AirPods Pro', price: 249, category: 'audio' },
    ],
  },
] as const;

export function ScopedCartsDemo() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
        One <code>cartStore</code> definition. Each shop calls{' '}
        <code>cartStore.scope(shopId)</code> and gets its own isolated state instance.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {SHOPS.map((shop) => (
          <ShopCart
            key={shop.id}
            shopId={shop.id}
            label={shop.label}
            accent={shop.accent}
            catalog={shop.catalog as readonly CartProduct[]}
          />
        ))}
      </div>
    </div>
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
  const categoryForExample = catalog[0]?.category ?? 'shoes';
  const categoryTotal = scoped.useSelector('totalByCategory', categoryForExample);
  const discountedTotal = scoped.useSelector('discountedTotal', 0.1);
  const { add, remove, clear } = scoped.useActions();

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: `1px solid ${accent}33`,
        background: '#fff',
        display: 'grid',
        gap: 12,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: accent,
              textTransform: 'uppercase',
            }}
          >
            scope: {shopId}
          </p>
          <h4 style={{ margin: '4px 0 0', fontSize: 18 }}>{label}</h4>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            background: `${accent}14`,
            color: accent,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {count} item{count === 1 ? '' : 's'}
        </span>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {catalog.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => add(product)}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              border: `1px solid ${accent}33`,
              background: '#fff',
              color: accent,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            + {product.name} (${product.price})
          </button>
        ))}
      </div>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gap: 6,
          minHeight: 60,
        }}
      >
        {items.length === 0 ? (
          <li style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>Empty</li>
        ) : (
          items.map((item) => (
            <li
              key={item.lineId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 10px',
                borderRadius: 8,
                background: 'rgba(15,23,42,0.04)',
                fontSize: 13,
              }}
            >
              <span>{item.name}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#64748b' }}>${item.price}</span>
                <button
                  type="button"
                  onClick={() => remove(item.lineId)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#b91c1c',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ×
                </button>
              </span>
            </li>
          ))
        )}
      </ul>

      <footer
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingTop: 8,
          borderTop: '1px solid rgba(15,23,42,0.06)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 4,
            fontSize: 12,
            color: '#475569',
          }}
        >
          <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 800 }}>
            Total: ${total}
          </span>
          <span>
            parameterized view · <code>totalByCategory("{categoryForExample}")</code>: $
            {categoryTotal}
          </span>
          <span>
            computed view · <code>discountedTotal(0.1)</code>: ${discountedTotal}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={clear}
            disabled={items.length === 0}
            style={{
              border: 'none',
              background: 'transparent',
              color: items.length === 0 ? '#cbd5e1' : '#b91c1c',
              fontSize: 12,
              fontWeight: 700,
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      </footer>
    </div>
  );
};
