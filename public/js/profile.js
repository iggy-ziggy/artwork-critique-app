const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const pronouns = document.querySelector('#pronouns').value.trim();
  const bio = document.querySelector('#bio').value.trim();
  const media = document.querySelector('#media').value.trim();
  const profilePicture = document.querySelector('#profile-picture').files[0];

  const profileData = {};

  if (name !== '') {
    profileData.name = name;
  }
  if (pronouns !== '') {
    profileData.pronouns = pronouns;
  }
  if (bio !== '') {
    profileData.bio = bio;
  }
  if (media !== '') {
    profileData.media = media;
  }
  if (profilePicture) {
    const profilePictureRef = storageRef.child(`profilePictures/${profilePicture.name}`);
    await profilePictureRef.put(profilePicture);
    const profilePictureURL = await profilePictureRef.getDownloadURL();
    profileData.profilePictureURL = profilePictureURL;
  }

  if (Object.keys(profileData).length > 0) {
    const response = await fetch(`/api/profile/update`, {
      method: 'POST',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to update profile');
    }
  }
};

document
  .querySelector('.create-profile-form')
  .addEventListener('submit', newFormHandler);

