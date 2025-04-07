// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaCamera } from "react-icons/fa";
import apiClient from "../api/apiClient"; // Adjust path based on your structure
import Sidebar from "../components/SideBar";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    specialty: "",
    location: "",
    bio: "",
  });
  const [profilePicture, setProfilePicture] = useState(null); // For file input
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        try {
          const response = await apiClient.get("/api/auth/me");
          const { name, email, role, specialty, location, bio, profilePicture } = response.data;
          setUser({
            name,
            email,
            password: "",
            role,
            specialty: specialty || "",
            location: location || "",
            bio: bio || "",
          });
          if (profilePicture) {
            setPreviewImage(`${process.env.REACT_APP_API_URL}/${profilePicture}`);
          }
        } catch (error) {
          console.error("Erreur lors du chargement du profil:", error);
          toast.error("Erreur lors du chargement du profil");
        }
      };
      fetchProfile();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    if (user.password) formData.append("password", user.password);
    if (user.role === "artisan") {
      formData.append("specialty", user.specialty);
      formData.append("location", user.location);
      formData.append("bio", user.bio);
      if (profilePicture) formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await apiClient.put("/api/auth/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser({ ...response.data, password: "" }); // Update state with server response
      if (response.data.profilePicture) {
        setPreviewImage(`${process.env.REACT_APP_API_URL}/${response.data.profilePicture}`);
      }
      toast.success("Profil mis à jour avec succès!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={user} />
      <div className="flex-1 ml-64 py-12 px-4 sm:px-8">
        <div className="container mx-auto max-w-full sm:max-w-2xl">
          <h2 className="section-title text-center">Mon Profil</h2>
          <form onSubmit={handleUpdate} className="card-modern p-6 sm:p-8">
            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={previewImage || "https://via.placeholder.com/120"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-light shadow-md"
                />
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-primary text-light p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-all duration-300"
                >
                  <FaCamera />
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-4">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={user.name}
                  onChange={handleInputChange}
                  className="input-modern"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleInputChange}
                  className="input-modern"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Nouveau mot de passe (optionnel)"
                  value={user.password}
                  onChange={handleInputChange}
                  className="input-modern"
                />
              </div>
            </div>

            {/* Artisan-Specific Fields */}
            {user.role === "artisan" && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-dark font-anton">Informations Artisan</h3>
                <div className="form-group">
                  <input
                    type="text"
                    name="specialty"
                    placeholder="Spécialité (ex. Plomberie)"
                    value={user.specialty}
                    onChange={handleInputChange}
                    className="input-modern"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="location"
                    placeholder="Localisation (ex. Paris, France)"
                    value={user.location}
                    onChange={handleInputChange}
                    className="input-modern"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="bio"
                    placeholder="Bio (parlez de vous)"
                    value={user.bio}
                    onChange={handleInputChange}
                    className="input-modern"
                    rows="4"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 flex justify-center items-center"
            >
              {loading ? <ClipLoader size={20} color="#f9f8f8" /> : "Mettre à jour"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;