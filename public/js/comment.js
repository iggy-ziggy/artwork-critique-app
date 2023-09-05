document.addEventListener('DOMContentLoaded', () => {
  console.log('Comment.js loaded');
  const commentForm = document.querySelector('#comment-form');
  const commentBox = document.querySelector('#comment-box');
  const commentContainer = document.querySelector('#comment-container');
  const artworkContainer = document.querySelector('#artwork-container');
  const currentUrl = window.location.href;
  const urlParts = currentUrl.split('/');
  const artwork_id = urlParts[urlParts.length - 1];

  if (!isNaN(parseInt(artwork_id))) {
    console.log('artwork_id:', artwork_id);
  } else {
    console.error('Invalid artwork_id:', artwork_id);
  }


  // Handle emoji click events
  async function handleEmojiClick(event, targetType, targetId, emojiType) {
    if (event.target.classList.contains('emoji')) {
      if (emojiType && targetType && targetId) {
        try {
          const emojiData = {
            emojiType,
            targetType,
            targetId
          };
          // Send a request to update the emoji count on the server
          const response = await fetch('/api/artwork/update-emoji', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emojiData)
          });
  
          if (response.ok) {
            // Update the displayed emoji count on the page
            updateEmojiCount(targetType, targetId, emojiType);
          } else {
            console.error('Failed to update emoji count');
          }
        } catch (error) {
          console.error('Error:', error); // Log other errors
        }
      }
    }
  }

  // Add an event listener for both artwork and comment emoji button clicks
  commentContainer.addEventListener('click', (event) => {
    handleEmojiClick(event, 'comment', event.target.dataset.targetId, event.target.dataset.emojiType);
  });

  // Add an event listener for artwork emoji button clicks
  artworkContainer.addEventListener('click', (event) => {
    handleEmojiClick(event, 'artwork', event.target.dataset.targetId, event.target.dataset.emojiType);
  });

  // Function to update the displayed emoji count on the page
  function updateEmojiCount(targetType, targetId, emojiType) {
    const emojiCountElement = document.querySelector(`#emoji-count-${targetType}-${targetId}-${emojiType}`);
    if (emojiCountElement) {
      // You can parse the current count, increment it, and update the element
      let currentCount = parseInt(emojiCountElement.textContent);
      if (!isNaN(currentCount)) {
        currentCount++;
        emojiCountElement.textContent = currentCount;
      }
    }
  }

  // Submit a new comment
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const commentText = commentBox.value.trim();

    if (commentText) {
      try {
        const response = await fetch(`/api/artwork/${artwork_id}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: commentText }),
        });

        if (response.ok) {
          // Optionally, clear the comment input box here if needed
          commentBox.value = '';
          window.location.reload();
          // You can fetch and render comments here if needed
        } else {
          console.error('Failed to submit comment');
        }
      } catch (error) {
        console.error('Fetch Error:', error); // Log fetch-related errors
      }
    }
  });
});