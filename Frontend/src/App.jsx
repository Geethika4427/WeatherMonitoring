import WeatherSummary from './Components/WeatherSummary';
import WeatherDisplay from './Components/WeatherDisplay';
import Alerts from './Components/Alerts';
import HistoricalData from './Components/HistoricalData';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Weather Monitoring System</h1>
        <WeatherDisplay/>
        <WeatherSummary/>
        <HistoricalData/>
        <Alerts/> 
      </header>
    </div>
  );
}
export default App;
