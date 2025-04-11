import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import Navbar from './Components/Navbar';
import SearchPanel from './Components/SearchPanel';
import CatalogueGrid from './Components/CatalogeGrid'

function App() {
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [view, setView] = useState('search'); // 'search' or 'catalogue'
  const [expandedItemIndex, setExpandedItemIndex] = useState(null);

  useEffect(() => {
    fetch('/Subnautica Item Recipes.xlsx')
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const formattedData = jsonData.slice(1).map(row => ({
          item: row[0],
          recipe: row[1] ? row[1].split(',').map(r => r.trim().toLowerCase()) : [],
          craftedUsing: row[2],
          category: row[3],
          subcategory: row[4],
          obtainableFrom: row[5],
        }));

        setRecipes(formattedData);
      })
      .catch(error => console.error('Error loading Excel file:', error));
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
  
    if (value.length > 0) {
      const matchingItems = recipes.filter(item =>
        item.item.toLowerCase().includes(value.toLowerCase())
      );
      // Use the matched item names as suggestions
      setSuggestions(matchingItems.map(item => item.item));
    } else {
      setSuggestions([]);
      setFilteredItems([]);
    }
  };
  
  // Update handleSuggestionClick to filter by exact item name:
  const handleSuggestionClick = (selectedItem) => {
    setInput(selectedItem);
    setSuggestions([]);
  
    const matchingItems = recipes.filter(item =>
      item.item.toLowerCase() === selectedItem.toLowerCase()
    );
    setFilteredItems(matchingItems);
  };
  const handleCatalogueItemClick = (index) => {
    setExpandedItemIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="App">
      <Navbar setView={setView} />
      <div className="background-container">
        <div className="content-box">
          <h1 className="title">
            Crafting Recipe {view === 'catalogue' ? 'Catalogue' : 'Search'}
          </h1>
          {view === 'catalogue' ? (
            <CatalogueGrid
              recipes={recipes}
              expandedItemIndex={expandedItemIndex}
              handleCatalogueItemClick={handleCatalogueItemClick}
            />
          ) : (
            <SearchPanel
              input={input}
              setInput={setInput}
              suggestions={suggestions}
              handleSuggestionClick={handleSuggestionClick}
              filteredItems={filteredItems}
              handleChange={handleChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;