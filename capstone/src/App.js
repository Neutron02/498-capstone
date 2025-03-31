import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    console.log("Fetching CSV file...");
    fetch(`${process.env.PUBLIC_URL}/Subnautica%20Item%20Recipes.csv`)
      .then((response) => response.text())
      .then((data) => {
        console.log("CSV data fetched:", data);

        // parse csv
        const lines = data.trim().split('\n');
        console.log("CSV lines:", lines);
        if (lines.length === 0) {
          console.log("No lines found in CSV.");
          return;
        }

        // parse headers
        const headers = lines[0].split(',').map((header) => header.trim());
        console.log("Parsed headers:", headers);

        // parse rows
        const rows = lines.slice(1).map((line, index) => {
          const values = line.split(',').map((val) => val.trim());
          const rowObj = {};
          headers.forEach((header, i) => {
            rowObj[header] = values[i] || '';
          });
          console.log(`Row ${index}:`, rowObj);
          return rowObj;
        });
        console.log("All parsed rows:", rows);
        setCsvData(rows);
      })
      .catch((error) => console.error('Error fetching CSV:', error));
  }, []);

  // input change and filter
  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log("Input change, value:", value);
    setSearchTerm(value);
    setSelectedResult(null);
  
    // filter suggestions
    if (value.length > 0) {
      const filtered = csvData.filter((row) =>
        row['Item'] && row['Item'].toLowerCase().includes(value.toLowerCase())
      );
      console.log("Filtered suggestions:", filtered);
      setSuggestions(filtered.slice(0, 10));  // limit suggestions to 10
    } else {
      console.log("Clearing suggestions.");
      setSuggestions([]);
    }
  };

  // select suggestion
  const handleSelectSuggestion = (suggestion) => {
    console.log("Selected suggestion:", suggestion);
    setSearchTerm(suggestion['Item']);
    setSelectedResult(suggestion);
    setSuggestions([]);
  };

  // submit search
  const handleSubmit = () => {
    console.log("Submit clicked. Searching for:", searchTerm);
    const matching = csvData.find(
      (row) => row['Item'] && row['Item'].toLowerCase() === searchTerm.toLowerCase()
    );
    console.log("Matching row:", matching);
    setSelectedResult(matching || null);
    setSuggestions([]);
  };

  return (
    <div className="App">
      <h1>Item Lookup</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type an item..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={handleSubmit} type="button" className="submit-button">
          Submit
        </button>
      </div>
      
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(s)}>
              {s['Item']}
            </li>
          ))}
        </ul>
      )}
      
      {selectedResult && (
        <div className="result">
          <h2>{selectedResult['Item']}</h2>
          <table className="result-table">
            <thead>
              <tr>
                <th>Characteristic</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(selectedResult)
                .filter((key) => key !== 'Item')
                .map((key, index) => (
                  <tr key={index}>
                    <td><strong>{key}</strong></td>
                    <td>{selectedResult[key]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;