import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaTag } from 'react-icons/fa';

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', skills: '', companyName: '', profilePhoto: '' });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5001/api/users/profile/${user.uid}`)
        .then(({ data }) => setFormData({
          name: data.name,
          skills: data.skills?.join(', ') || '',
          companyName: data.companyName || '',
          profilePhoto: data.profilePhoto || '',
        }))
        .catch(() => toast.error('Failed to load profile'));
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profilePhoto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('skills', formData.skills);
      form.append('companyName', formData.companyName);
      if (photoFile) form.append('profilePhoto', photoFile);

      await axios.put(`http://localhost:5001/api/users/profile/${user.uid}`, form, {
        headers: { 
          Authorization: `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-blue-950">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-neon w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">Edit Profile</h2>
        <div className="mb-4">
          <label className="flex items-center text-gray-300"><FaUser className="mr-2" /> Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 bg-gray-900 text-white rounded"
            required
          />
        </div>
        {user?.role === 'student' && (
          <div className="mb-4">
            <label className="flex items-center text-gray-300"><FaTag className="mr-2" /> Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full p-2 bg-gray-900 text-white rounded"
            />
          </div>
        )}
        {user?.role === 'startup' && (
          <div className="mb-4">
            <label className="flex items-center text-gray-300"><FaTag className="mr-2" /> Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2 bg-gray-900 text-white rounded"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="flex items-center text-gray-300"><FaTag className="mr-2" /> Profile Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full p-2 bg-gray-900 text-white rounded" />
          {formData.profilePhoto && <img src={formData.profilePhoto} alt="Preview" className="w-24 h-24 rounded-full mt-2" />}
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white py-2 rounded hover:scale-105 shadow-neon">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;