import SurveyCreatorRenderComponent from './components/SurveyCreator';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Survey Application</h1>
      </header>
      <main>
        <SurveyCreatorRenderComponent />
      </main>
    </div>
  );
}

export default App;