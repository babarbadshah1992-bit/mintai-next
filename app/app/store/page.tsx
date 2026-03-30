import { PRODUCTS } from '@/lib/products'

export default function StorePage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🛍️ All Products</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '24px'
      }}>
        {PRODUCTS.map(product => (
          <a
            key={product.id}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid rgba(46,158,79,0.1)',
              transition: 'transform 0.2s'
            }}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '12px' }}>{product.image}</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '12px' }}>{product.description}</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2e9e4f' }}>{product.price}</span>
              <span style={{ textDecoration: 'line-through', color: '#999' }}>{product.originalPrice}</span>
              <span style={{ background: '#ff69b4', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem' }}>{product.discount}</span>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#ffc107' }}>{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>({product.rating})</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}