import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import SecretarySidebar from "../../components/secretary/SecretraySidebar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const SecretaryMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [filter, setFilter] = useState("new");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchMessages();
    }
  }, [token]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/messages");
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (messageId, status) => {
    try {
      await apiClient.put("/api/messages/status", { messageId, status });
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, status } : msg
      ));
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const filteredMessages = messages.filter(msg => 
    filter === "all" ? true : msg.status === filter
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <SecretarySidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold">Messages des clients</h2>
              <div className="flex gap-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input-modern"
                >
                  <option value="all">Tous</option>
                  <option value="new">Nouveaux</option>
                  <option value="contacted">Contactés</option>
                  <option value="resolved">Résolus</option>
                </select>
                <button
                  onClick={fetchMessages}
                  className="btn-primary"
                >
                  Rafraîchir
                </button>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <p className="text-center text-dark/70">Aucun message trouvé</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="card-modern p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{message.name}</h3>
                    <span className={`badge ${
                      message.status === 'new' ? 'bg-primary/10 text-primary' :
                      message.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-dark/70 mb-4">
                    <p><strong>Service:</strong> {message.serviceType}</p>
                    <p><strong>Téléphone:</strong> {message.phone}</p>
                    <p><strong>Adresse:</strong> {message.address}</p>
                    <p><strong>email:</strong> {message.email}</p>
                    <p><strong>Horaire préféré:</strong> {message.preferredTime}</p>
                    <p><strong>Message:</strong> {message.reason}</p>
                    <p className="text-sm">
                      <strong>Reçu le:</strong> {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {message.status === 'new' && (
                      <button
                        onClick={() => handleUpdateStatus(message._id, 'contacted')}
                        className="btn-primary flex-1"
                      >
                        Marquer comme contacté
                      </button>
                    )}
                    {message.status === 'contacted' && (
                      <button
                        onClick={() => handleUpdateStatus(message._id, 'resolved')}
                        className="btn-primary flex-1"
                      >
                        Marquer comme résolu
                      </button>
                    )}
                    <button
            className="btn-secondary w-full mt-2"
            onClick={() =>
              navigate("/secretary/booking", { state: { initialData: message } })
            }
          >
            Créer un RDV
          </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretaryMessages;