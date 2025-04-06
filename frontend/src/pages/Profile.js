import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaCamera } from "react-icons/fa";
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
      axios
        .get("http://localhost:5000/api/auth/me", { headers: { "x-auth-token": token } })
        .then((response) => {
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
            setPreviewImage(`http://localhost:5000/${profilePicture}`);
          }
        })
        .catch((error) => console.error("Erreur lors du chargement du profil:", error));
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
      const response = await axios.put("http://localhost:5000/api/auth/me", formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser({ ...response.data, password: "" }); // Update state with server response
      if (response.data.profilePicture) {
        setPreviewImage(`http://localhost:5000/${response.data.profilePicture}`);
      }
      toast.success("Profil mis à jour avec succès!");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-8 font-poppins">
      <Sidebar userInfo={user} />
      <div className="container mx-auto max-w-full sm:max-w-2xl">
        <h2 className="section-title text-center">
          Mon Profil
        </h2>
        
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
              <h3 className="text-lg sm:text-xl font-semibold text-dark">Informations Artisan</h3>
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
  );
};

export default Profile;