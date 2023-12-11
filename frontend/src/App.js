import './App.css';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className="App">
        <TodoApp />
        <h1 className='text-xl'>NOTE: After every add/modify/delete operation press the Get Tasks for eneterd Email button</h1>
    </div>
  );
}

export default App;
