import './App.css';

const onSubmit = (event) => {
// print the value from the input field
  const inputValue = event.target.previousElementSibling.value;
  console.log(inputValue);

  // clear the input field
  event.target.previousElementSibling.value = '';
}

function App() {
  return (
    // I don't wnat autocomplete. I just want a simple user input
    <div className="App">
      <h1>Simple User Input</h1>
      <input type="text" placeholder="Type something..."/>
      <button onClick={onSubmit} type="button">Submit</button>
    </div>
  );
}

export default App;
