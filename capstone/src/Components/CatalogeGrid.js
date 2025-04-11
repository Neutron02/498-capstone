import React from 'react';

function CatalogueGrid({ recipes, expandedItemIndex, handleCatalogueItemClick }) {
  return (
    <div className="catalogue-grid">
      {recipes.map((item, index) => (
        <div key={index} className="catalogue-item" onClick={() => handleCatalogueItemClick(index)}>
          <h3>{item.item}</h3>
          <p><strong>Crafted Using:</strong> {item.craftedUsing}</p>
          <p><strong>Category:</strong> {item.category}</p>
          {expandedItemIndex === index && (
            <div className="dropdown-details">
              <p>
                <strong>Crafting Recipe:</strong>{' '}
                {item.recipe.length > 0 ? item.recipe.join(', ') : 'None'}
              </p>
              <p><strong>Subcategory:</strong> {item.subcategory}</p>
              <p><strong>Obtainable From:</strong> {item.obtainableFrom}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CatalogueGrid;