const searchFormHandler = async (event) => {
  event.preventDefault();

  const result = document.querySelector('#search-bar').value.trim();

  const response = await fetch(`/search/${result}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace(`/search/${result}`);
  }
};

document
  .querySelector('.search-form')
  .addEventListener('submit', searchFormHandler);
