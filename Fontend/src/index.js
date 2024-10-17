import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // API URL จาก Render.com
    const apiUrl = 'https://projectsrapingset.onrender.com/api/data';

    axios.get(apiUrl)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching the API:', error);
      });
  }, []);

  return (
    <div>
      <h1>SET Stock Data</h1>
      {data ? (
        <div>
          {/* แสดงข้อมูลจากตาราง SET */}
          {data.SET_data && (
            <div>
              <h2>SET Data</h2>
              <pre>{JSON.stringify(data.SET_data, null, 2)}</pre>
            </div>
          )}

          {/* แสดงข้อมูลจากตาราง mai */}
          {data.mai_data && (
            <div>
              <h2>mai Data</h2>
              <pre>{JSON.stringify(data.mai_data, null, 2)}</pre>
            </div>
          )}

          {/* แสดงข้อมูลการขายชอร์ต */}
          {data.overview_data && (
            <div>
              <h2>Short Selling Overview</h2>
              <pre>{JSON.stringify(data.overview_data, null, 2)}</pre>
            </div>
          )}

          {/* แสดงข้อมูลรายหลักทรัพย์ (Short Sell) */}
          {data.short_sell_data && (
            <div>
              <h2>Short Sell Data (by Security)</h2>
              <pre>{JSON.stringify(data.short_sell_data, null, 2)}</pre>
            </div>
          )}

          {/* แสดงข้อมูลการทำธุรกรรมโปรแกรมเทรด */}
          {data.program_trading_data && (
            <div>
              <h2>Program Trading Data</h2>
              <pre>{JSON.stringify(data.program_trading_data, null, 2)}</pre>
            </div>
          )}

          {/* แสดงข้อมูลรายหลักทรัพย์ (Program Trading) */}
          {data.security_data && (
            <div>
              <h2>Security Data (Program Trading)</h2>
              <pre>{JSON.stringify(data.security_data, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default App;
