import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/';
import { auth, storage } from '../../firebase';
import { updatePassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

function Profile() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState(user?.photoURL || '');
  const [themeColor, setThemeColor] = useState('#3B82F6'); // default blue

  useEffect(() => {
    // Set the initial theme color
    document.title = "Profile";
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(`Error updating password: ${error.message}`);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;

    const avatarRef = ref(storage, `avatars/${user.uid}`);
    try {
      const snapshot = await uploadBytes(avatarRef, avatar);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setAvatarURL(downloadURL);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error(`Error uploading avatar: ${error.message}`);
    }
  };

  const handleColorChange = (color) => {
    setThemeColor(color);
    document.documentElement.style.setProperty('--theme-color', color);
    // Here you would typically save the user's color preference to your backend
    toast.success('Theme color updated');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Reset Password
          </button>
        </form>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Avatar</h2>
        <div className="flex items-center space-x-4">
          <img src={avatarURL || 'https://via.placeholder.com/100'} alt="Avatar" className="w-20 h-20 rounded-full" />
          <div>
            <input type="file" onChange={handleAvatarChange} accept="image/*" className="mb-2" />
            <button onClick={handleAvatarUpload} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Upload Avatar
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Theme Color</h2>
        <div className="flex space-x-2">
          {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              style={{ backgroundColor: color }}
              className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;