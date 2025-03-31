import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

function App() {
  // Declaring state variables
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetch('/Subnautica Item Recipes.xlsx')
      .then(response => response.arrayBuffer()) // Fetches binary data of the Excel file
      .then(data => {
        // Parses the binary into a workbook, then gets the sheet of information and converts that sheet data to a JSON array
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const formattedData = jsonData.slice(1).map(row => ({
          item: row[0], // Item name
          recipe: row[1] ? row[1].split(',').map(r => r.trim().toLowerCase()) : [], // Item recipe
          craftedUsing: row[2], // Location item is crafted at
          category: row[3], // Type of item
          subcategory: row[4], // Subcategory of item
          obtainableFrom: row[5], // How to optain crafting recipe for item
        }));

        setRecipes(formattedData);
      })
      .catch(error => console.error('Error loading Excel file:', error));
  }, []);

  // Handle input change in search bar
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const uniqueMaterials = new Set();

      // Grabs all items with matching resource in crafting recipe
      recipes.forEach(item => {
        item.recipe.forEach(material => {
          if (material.toLowerCase().includes(value.toLowerCase())) {
            uniqueMaterials.add(material.toLowerCase());
          }
        });
      });

      // As user types into search bar, gives real time possible materials to look up
      setSuggestions(Array.from(uniqueMaterials));
    } else {
      setSuggestions([]);
      setFilteredItems([]);
    }
  };

  // When dropdown material is clicked, it is updated as the material being searched
  const handleSuggestionClick = (selectedMaterial) => {
    setInput(selectedMaterial);
    setSuggestions([]);

    const matchingItems = recipes.filter(item =>
      item.recipe.some(material => material.toLowerCase() === selectedMaterial.toLowerCase())
    );

    setFilteredItems(matchingItems);
  };

  return (
    <div className="App">
      <div className="background-container">
        <div className="content-box">
          <h1 className="title">Crafting Recipe Search</h1>

          {/* Search Bar */}
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

          {/* Table Section */}
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
      </div>
    </div>
  );
}

export default App;