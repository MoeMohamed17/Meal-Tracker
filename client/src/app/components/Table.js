import { useState, useEffect } from 'react';
import styles from './Table.css';

const Table = ({ tableData, tableName }) => {
  // Initialize columnConfig from the keys of the first row, or empty if no data
  const initialColumnConfig = tableData.length > 0 ? Object.keys(tableData[0]).reduce((config, column) => {
    config[column] = true;
    return config;
  }, {}) : {};

  const [columns, setColumns] = useState(initialColumnConfig);

  useEffect(() => {
    // Update columns when tableData changes
    if (tableData.length > 0) {
      const newColumnConfig = Object.keys(tableData[0]).reduce((config, column) => {
        config[column] = columns[column] ?? true; // Preserve user selection or default to true
        return config;
      }, {});
      setColumns(newColumnConfig);
    }
  }, [tableData]);

  const handleColumnChange = (column) => {
    setColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className='table-container'>
      <h2>{tableName}</h2>
      <div className='column-space'>
        {Object.keys(columns).map((column) => (
          <div key={column} className='columns-checkboxes'>
            <input
              type="checkbox"
              checked={columns[column]}
              onChange={() => handleColumnChange(column)}
            />
            <label>{column.charAt(0).toUpperCase() + column.slice(1)}</label> 
          </div>
        ))}
      </div>
      {tableData.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.entries(columns)
                .filter(([_, isVisible]) => isVisible)
                .map(([column]) => (
                  <th key={column}>{column.charAt(0).toUpperCase() + column.slice(1)}</th> 
                ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {Object.entries(columns)
                  .filter(([_, isVisible]) => isVisible)
                  .map(([column]) => (
                    <td key={column}>{row[column]}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Table;
