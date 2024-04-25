export function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json()
}

export function handleError(error, name) {
    alert(`Error fetching ${name}: ${error.message}`); // Alerting the error message
}

export function handleFetch(query, setFn, errorName) {
    fetch(query)
      .then(handleResponse)
      .then(setFn)
      .catch(e => handleError(e, errorName));
}