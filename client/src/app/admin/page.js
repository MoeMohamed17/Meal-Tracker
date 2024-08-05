
'use client'
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import NavBar from '../components/NavBar';

const Admin = () => {
  const [tables, setTables] = useState([]); // List of available tables
  const [selectedTable, setSelectedTable] = useState(''); // Currently selected table
  const [tableData, setTableData] = useState([]); // Data for the selected table
  const [availableColumns, setAvailableColumns] = useState([]); // All columns of the selected table
  const [configuredColumns, setConfiguredColumns] = useState([]); // Columns being configured
  const [visibleColumns, setVisibleColumns] = useState([]); // Columns currently visible
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch available tables when component mounts
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        const tablesJson = await response.json();
        setTables(tablesJson.data); // Set tables from response
        if (tablesJson.data.length > 0) {
          setSelectedTable(tablesJson.data[0]); // Select first table by default
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  // Fetch data and columns for the selected table
  useEffect(() => {
    const fetchTableData = async () => {
      if (!selectedTable) return;
      setLoading(true);
      try {
        // Fetch columns for the selected table
        const columnsResponse = await fetch(`/api/table-columns?table=${selectedTable}`);
        if (!columnsResponse.ok) {
          throw new Error(`Failed to fetch columns for table ${selectedTable}`);
        }
        const columnsJson = await columnsResponse.json();
        const columns = columnsJson.data || [];
        setAvailableColumns(columns); // Set available columns
        setConfiguredColumns(columns); // Set configured columns to all initially
        setVisibleColumns(columns); // Show all columns initially

        // Fetch data for the selected columns
        const dataResponse = await fetch(`/api/table-data?table=${selectedTable}&columns=${columns.join(',')}`);
        if (!dataResponse.ok) {
          throw new Error(`Failed to fetch data for table ${selectedTable}`);
        }
        const dataJson = await dataResponse.json();
        setTableData(dataJson.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [selectedTable]);

  const handleColumnToggle = (column) => {
    setConfiguredColumns((prevConfiguredColumns) => {
      if (prevConfiguredColumns.includes(column)) {
        // Remove column from configuration
        return prevConfiguredColumns.filter((col) => col !== column);
      } else {
        // Add column back to configuration in the original order
        return availableColumns.filter((col) => prevConfiguredColumns.includes(col) || col === column);
      }
    });
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      const columnsQuery = configuredColumns.join(','); // Prepare configured columns
      const dataResponse = await fetch(`/api/table-data?table=${selectedTable}&columns=${columnsQuery}`);
      if (!dataResponse.ok) {
        throw new Error(`Failed to fetch data for table ${selectedTable}`);
      }
      const dataJson = await dataResponse.json();
      setTableData(dataJson.data || []);
      setVisibleColumns(configuredColumns); // Update visible columns after refresh
      setError(null);
    } catch (error) {
      console.error('Error refreshing table data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <NavBar />
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="table-select">Select a table: </label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value);
            setAvailableColumns([]);
            setConfiguredColumns([]);
            setVisibleColumns([]);
            setTableData([]);
          }}
        >
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>
      {loading && <p>Loading data...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && selectedTable && (
        <div>
          <div>
            {availableColumns.map((column) => (
              <label key={column} style={{ marginRight: '10px' }}>
                <input
                  type="checkbox"
                  checked={configuredColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                />
                {column}
              </label>
            ))}
          </div>
          <button onClick={handleRefreshData}>Refresh Data</button>
          <Table tableData={tableData} tableName={selectedTable} columns={visibleColumns} />
        </div>
      )}
    </div>
  );
};

export default Admin;

