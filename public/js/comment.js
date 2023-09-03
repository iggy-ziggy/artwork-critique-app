const commentFormHandler = async (event) => {
  event.preventDefault();

  const comment = document.querySelector('#comment-box').value.trim();

  if (comment) {
    const response = await fetch('api/artwork/:id/comment', {
      method: 'POST',
      body: JSON.stringify(comment),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.reload();
    }
  }
};

document.querySelector('#comment-form').addEventListener('submit', commentFormHandler);