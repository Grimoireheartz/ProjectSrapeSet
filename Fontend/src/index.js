import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API URL จาก Render.com
    const apiUrl = 'https://projectsrapingset.onrender.com/api/data';

    axios.get(apiUrl)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching the API');
        setLoading(false);
        console.error('Error fetching the API:', error);
      });
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>SET Stock Data</h1>
      {data ? (
        <div>
          {/* แสดงข้อมูลจากตาราง SET */}
          {data.SET_data && data.SET_data.length > 0 ? (
            <div>
              <h2>SET Data</h2>
              <pre>{JSON.stringify(data.SET_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No SET Data available</p>
          )}

          {/* แสดงข้อมูลจากตาราง mai */}
          {data.mai_data && data.mai_data.length > 0 ? (
            <div>
              <h2>mai Data</h2>
              <pre>{JSON.stringify(data.mai_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No mai Data available</p>
          )}

          {/* แสดงข้อมูลการขายชอร์ต */}
          {data.overview_data && data.overview_data.length > 0 ? (
            <div>
              <h2>Short Selling Overview</h2>
              <pre>{JSON.stringify(data.overview_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No Overview Data available</p>
          )}

          {/* แสดงข้อมูลรายหลักทรัพย์ (Short Sell) */}
          {data.short_sell_data && data.short_sell_data.length > 0 ? (
            <div>
              <h2>Short Sell Data (by Security)</h2>
              <pre>{JSON.stringify(data.short_sell_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No Short Sell Data available</p>
          )}

          {/* แสดงข้อมูลการทำธุรกรรมโปรแกรมเทรด */}
          {data.program_trading_data && data.program_trading_data.length > 0 ? (
            <div>
              <h2>Program Trading Data</h2>
              <pre>{JSON.stringify(data.program_trading_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No Program Trading Data available</p>
          )}

          {/* แสดงข้อมูลรายหลักทรัพย์ (Program Trading) */}
          {data.security_data && data.security_data.length > 0 ? (
            <div>
              <h2>Security Data (Program Trading)</h2>
              <pre>{JSON.stringify(data.security_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No Security Data available</p>
          )}
        </div>
      ) : (
        <p>No data available from the API.</p>
      )}
    </div>
  );
};

export default App;
