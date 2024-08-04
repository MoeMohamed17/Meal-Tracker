import React, { useState } from 'react';
import './Table.css'; 

const Table = ({ tableData, tableName, columns }) => {
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <p>No data available for {tableName}.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
            {columns.map((col) => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
