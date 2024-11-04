import { useEffect, useState } from 'react';
import axios from 'axios';
import './Alerts.css'; // Import the CSS file

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
       // const response = await axios.get('http://localhost:5000/api/alerts'); 
       const response = await axios.get('http://localhost:5002/api/alerts');
        setAlerts(response.data);
      } catch (err) {
        setError('Error fetching alerts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return <p>Loading alerts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="alerts-container">
      <h2>Weather Alerts</h2>
      <ul className="alerts-list">
        {alerts.map((alert, index) => (
          <li key={index}>
            <span className="alert-city">{alert.city}</span>: {alert.condition} (Severity: <span className="alert-severity">{alert.severity}</span>)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
