import React from 'react';

function SearchPanel({ input, setInput, suggestions, handleSuggestionClick, filteredItems, handleChange }) {
  return (
    <div>
      <div className="dropdown-container">
        <input
          type="text"
          placeholder="Search for a material..."
          value={input}
          onChange={handleChange}
          className="search-bar"
        />
        {suggestions.length > 0 && (
          <ul className="dropdown">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Crafting Recipe</th>
              <th>Crafted Using</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Obtainable From</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.item}</td>
                  <td>{item.recipe.length > 0 ? item.recipe.join(', ') : 'None'}</td>
                  <td>{item.craftedUsing}</td>
                  <td>{item.category}</td>
                  <td>{item.subcategory}</td>
                  <td>{item.obtainableFrom}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SearchPanel;