document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', imageFile);
  
    try {
      const response = await fetch('/api/artworks', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        document.location.replace('/profile'); // Redirect to profile after successful upload
      } else {
        alert('Failed to upload artwork');
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
    }
  });