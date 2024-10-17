import React, { useState } from 'react';

const App = () => {
  // ตัวอย่างข้อมูลสำหรับทดสอบ
  const [data, setData] = useState({
    SET_data: [{ name: "Test SET Data" }],
    mai_data: [{ name: "Test mai Data" }],
    overview_data: [{ name: "Test Overview Data" }],
    short_sell_data: [{ name: "Test Short Sell Data" }],
    program_trading_data: [{ name: "Test Program Trading Data" }],
    security_data: [{ name: "Test Security Data" }]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
