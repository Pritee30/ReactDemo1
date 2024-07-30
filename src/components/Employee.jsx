import React, { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';

const Employee = () => {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ gender: "", country: "" });

  // Function to fetch initial data
  const fetchData = async () => {
    const response = await fetch('https://dummyjson.com/users');
    const result = await response.json();
    setData(result.users);
    setDisplayData(result.users.slice(0, 10));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch more data for infinite scroll
  const fetchMoreData = () => {
    const nextPage = page + 1;
    const newData = data.slice(nextPage * 10, (nextPage + 1) * 10);
    setDisplayData([...displayData, ...newData]);
    setPage(nextPage);
    if (newData.length === 0) setHasMore(false);
  };

  // Function to sort data by a specific key
  const sortData = (key) => {
    const sortedData = [...displayData].sort((a, b) => a[key] > b[key] ? 1 : -1);
    setDisplayData(sortedData);
  };

  // Function to apply filters
  const applyFilters = () => {
    let filteredData = data;
    if (filters.gender) {
      filteredData = filteredData.filter(item => item.gender === filters.gender);
    }
    if (filters.country) {
      filteredData = filteredData.filter(item => item.address.city.toLowerCase().includes(filters.country.toLowerCase()));
    }
    setDisplayData(filteredData.slice(0, 10));
    setPage(0);
    setHasMore(filteredData.length > 10);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="container px-3 py-3 border border-dark">
      <h1>Employees</h1>
      <div className="py-1 px-1">
        <label className="px-3">
          Gender:
          <select name="gender" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            placeholder="Filter by Country"
            onChange={handleFilterChange}
          />
        </label>
      </div>
      <InfiniteScroll
        dataLength={displayData.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div>Loading...</div>}
        endMessage={<p>No more items to load</p>}
      >
        <table className="text-center px-2 py-1">
          <thead>
            <tr>
              <th onClick={() => sortData('id')}>Id</th>
              <th>Image</th>
              <th onClick={() => sortData('firstName')}>Full Name</th>
              <th>Company</th>
              <th onClick={() => sortData('age')}>Demography</th>
              <th>Designation</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td><img src={item.image} alt="" style={{ height: '3rem', width: '5rem' }} /></td>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.company.name}</td>
                <td>{item.gender.charAt(0).toUpperCase()}/{item.age}</td>
                <td>{item.company.title}</td>
                <td>{item.address.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};  

export default Employee;
