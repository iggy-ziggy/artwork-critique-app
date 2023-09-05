const searchFormHandler = async (event) => {
    event.preventDefault();
  
    const result = document.querySelector('#search-bar').value.trim();
  
    const response = await fetch(`/search/${result}`, {
      method: 'GET',
    });
  
    if (response.ok) {
        const searchData = await response.json();
        console.log('Search Data from Server:', searchData);
        document.location.replace(`/search/${result}`);
    }
  };
  
  document
    .querySelector('.search-form')
    .addEventListener('submit', searchFormHandler);