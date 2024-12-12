import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Log the request parameters
        console.log("Sending API request with query:", query);

        const response = await axiosClient.get(`/questions/getQuestionsByConditions`, {
          params: { query: query },  // Pass the query parameter
        });

        console.log("API Response:", response);  // Log the response

        if (response.data.result && response.data.result.data) {
          setResults(response.data.result.data);  // Set results from response
        } else {
          setResults([]);  // If no results, set empty array
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        results.length > 0 ? (
          <ul>
            {results.map((question) => (
              <li key={question.questionId}>
                <h3>{question.title || 'No Title'}</h3>
                <p>{question.body || 'No Body Available'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )
      )}
    </div>
  );
};

export default SearchResult;
