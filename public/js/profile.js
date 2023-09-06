const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const pronouns = document.querySelector('#pronouns').value.trim();
  const bio = document.querySelector('#bio').value.trim();
  const media = document.querySelector('#media').value.trim();
  const profilePicture = document.querySelector('#profile-picture').files[0];

  const formData = new FormData();

  formData.append('name', name);
  formData.append('pronouns', pronouns);
  formData.append('bio', bio);
  formData.append('media', media);

  if (profilePicture) {
    formData.append('profilePicture', profilePicture); // Append the profile picture to FormData
  }

  if (formData.has('name') || formData.has('pronouns') || formData.has('bio') || formData.has('media') || formData.has('profilePicture')) {
    const response = await fetch('/api/profile/update', {
      method: 'POST',
      body: formData, // Use FormData for file upload
    });

    if (response.ok) {
      document.location.replace('/api/profile');
    } else {
      alert('Failed to update profile');
    }
  }
};

document.querySelector('.create-profile-form').addEventListener('submit', newFormHandler);