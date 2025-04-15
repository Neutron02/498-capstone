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
  const [searchMode, setSearchMode] = useState('itemSearch');

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

  // Handle input change in search bar
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {

      const uniqueMaterials = new Set();

      if (searchMode === 'itemSearch') {  
        // Grabs all items with matching resource in crafting recipe
        recipes.forEach(item => {
          item.recipe.forEach(material => {
            if (material.toLowerCase().includes(value.toLowerCase())) {
              uniqueMaterials.add(material.toLowerCase());
            }
          });
        });
      
        setSuggestions(Array.from(uniqueMaterials));
      
      } 
      else if (searchMode === 'recipeSearch') {
        // Grabs all recipes that match the item they are searching for
        const matchingItems = recipes.filter(item =>
          item.item.toLowerCase().includes(value.toLowerCase())
        );
      
        setSuggestions(matchingItems.map(item => item.item));  // This is for autocomplete
      
      } 
      else {
        setSuggestions([]);
        setFilteredItems([]);
      }
    }
  };
  
  // Update handleSuggestionClick to filter by exact item name:
  const handleSuggestionClick = (selectedSuggestion) => {
    setInput(selectedSuggestion);
    setSuggestions([]);
  
    if (searchMode === 'itemSearch') {
      // Find all items that use this material in their recipe
      const matchingItems = recipes.filter(item =>
        item.recipe.some(material => material.toLowerCase() === selectedSuggestion.toLowerCase())
      );
      setFilteredItems(matchingItems);
  
    } else if (searchMode === 'recipeSearch') {
      // Find the specific item (by item name)
      const matchingItems = recipes.filter(item =>
        item.item.toLowerCase() === selectedSuggestion.toLowerCase()
      );
      setFilteredItems(matchingItems);
    }
  };

  const handleCatalogueItemClick = (index) => {
    setExpandedItemIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const toggleSearchMode = () => {
    setSearchMode((prevMode) => (prevMode === 'itemSearch' ? 'recipeSearch' : 'itemSearch'));
  };

  return (
    <div className="App">
      <Navbar setView={setView} />
      <div className="background-container">
        <div className="content-box">
        <h1 className="title">
          {view === 'catalogue'
            ? 'Crafting Recipe Catalogue'
            : searchMode === 'recipeSearch'
            ? 'Crafting Recipe Search'
            : 'Item Search'}
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
              toggleSearchMode={toggleSearchMode}
              searchMode={searchMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;