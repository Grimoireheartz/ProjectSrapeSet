import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState({
    SET_data: [],
    mai_data: [],
    overview_data: [],
    short_sell_data: [],
    program_trading_data: [],
    security_data: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://projectsrapingset.onrender.com/api/data', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const jsonData = await response.json();

      // ตรวจสอบว่าข้อมูลที่ได้รับจาก API มีโครงสร้างตามที่คาดหวัง
      if (jsonData && typeof jsonData === 'object') {
        setData({
          SET_data: jsonData.SET_data || [],
          mai_data: jsonData.mai_data || [],
          overview_data: jsonData.overview_data || [],
          short_sell_data: jsonData.short_sell_data || [],
          program_trading_data: jsonData.program_trading_data || [],
          security_data: jsonData.security_data || [],
        });
      } else {
        throw new Error('Unexpected data structure received from API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>; // แสดงข้อผิดพลาดหากมี
  }

  return (
    <div>
      <h1>SET Stock Data</h1>
      {data ? (
        <div>
          {/* แสดงข้อมูลจากตาราง SET */}
          {data.SET_data.length > 0 ? (
            <div>
              <h2>SET Data</h2>
              <pre>{JSON.stringify(data.SET_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No SET Data available</p>
          )}

          {/* แสดงข้อมูลจากตาราง mai */}
          {data.mai_data.length > 0 ? (
            <div>
              <h2>mai Data</h2>
              <pre>{JSON.stringify(data.mai_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No mai Data available</p>
          )}

          {/* แสดงข้อมูลการขายชอร์ต */}
          {data.overview_data.length > 0 ? (
            <div>
              <h2>Short Selling Overview</h2>
              <pre>{JSON.stringify(data.overview_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No Overview Data available</p>
          )}

          {/* แสดงข้อมูลรายหลักทรัพย์ (Short Sell) */}
          {data.short_sell_data.length > 0 ? (
            <div>
              <h2>Short Sell Data (by Security)</h2>
              <pre>{JSON.stringify(data.short_sell_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No Short Sell Data available</p>
          )}

          {/* แสดงข้อมูลการทำธุรกรรมโปรแกรมเทรด */}
          {data.program_trading_data.length > 0 ? (
            <div>
              <h2>Program Trading Data</h2>
              <pre>{JSON.stringify(data.program_trading_data, null, 2)}</pre>
            </div>
          ) : (
            <p>No Program Trading Data available</p>
          )}

          {/* แสดงข้อมูลรายหลักทรัพย์ (Program Trading) */}
          {data.security_data.length > 0 ? (
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
