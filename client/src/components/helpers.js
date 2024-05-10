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

export function calc_dhm(durationInDays) {
    const days = Math.floor(durationInDays);
    const hours = Math.floor((durationInDays - days) * 24);
    const minutes = Math.round(((durationInDays - days) * 24 - hours) * 60);
  
    return `${days} days, ${hours} hours, ${minutes} mins`;
}
  
export function secondsToDHM(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
  
    return `${days}d ${hours}h ${minutes}m`;
}
  
export const getTooltipDataAttrs = (value) => {
    // Temporary hack around null value.date issue
    if (Object.values(value).some(val => val === null || val === undefined)) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      'data-tooltip-id': "my-tooltip",
      'data-tooltip-content': `${value.date.toISOString().slice(0, 10)} has count: ${value.count}`,
    };
};
  
export const handleClick = (value) => {
    alert(`You clicked on ${value.date.toISOString().slice(0, 10)} with count: ${value.count}`);
};

export function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}

export function github_colour(value) {
    if (!value) {
        return 'color-empty';
    }
    const val = value.count >= 4 ? 4 : value.count;
    return `color-github-${val}`;
}