import React, { useState } from "react";
import "./UserProfile.css";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../actions/users"; // Import the action

const EditProfileForm = ({ currentUser, setSwitch }) => {
  const [name, setName] = useState(currentUser?.result?.name || "");
  const [about, setAbout] = useState(currentUser?.result?.about || "");
  const [tags, setTags] = useState(currentUser?.result?.tags.join(' ') || ""); // Assuming tags is an array
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !about) {
      alert("Please fill out all required fields.");
      return;
    }

    const profileData = {
      name,
      about,
      tags: tags.split(' ').filter(tag => tag) // Split and filter empty tags
    };

    try {
      await dispatch(updateUserProfile(currentUser?.result?.userId, profileData));
      setSwitch(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle errors (e.g., show a notification)
      alert("Error updating profile. Please try again.");
    }
    
  return (
    <div>
      <h1 className="edit-profile-title">Edit Your Profile</h1>
      <h2 className="edit-profile-title-2">Public Information</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label htmlFor="name">
          <h3>Display Name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label htmlFor="about">
          <h3>About Me</h3>
          <textarea
            cols="30"
            rows="10"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </label>
        <label htmlFor="tags">
          <h3>Watched Tags</h3>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Save Profile" className="user-submit-btn" />
        <button type="button" className="user-cancel-btn" onClick={() => setSwitch(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};
}
export default EditProfileForm;