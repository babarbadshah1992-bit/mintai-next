import { PRODUCTS } from "../../lib/products"

export default function StorePage() {
  return (
    <div>
      <h1>🛍️ All Products</h1>
      <div className="product-grid">
        {PRODUCTS.map(p => (
          <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="product-card">
            <div className="product-image">{p.image}</div>
            <h3>{p.name}</h3>
            <div className="price">
              <span className="current">{p.price}</span>
              <span className="original">{p.originalPrice}</span>
              <span className="discount">{p.discount}</span>
            </div>
            <p>{p.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}