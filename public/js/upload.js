document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('artwork-picture').files[0];
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('artworkPicture', imageFile);
  
    try {
      const response = await fetch('/api/artwork/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        document.location.replace('/api/profile'); // Redirect to profile after successful upload
      } else {
        alert('Failed to upload artwork');
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
    }
  });