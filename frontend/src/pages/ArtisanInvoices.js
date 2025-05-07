import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Sidebar from "../components/SideBar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/apiClient";
import { FaFileInvoice, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import FullInvoiceModal from "../components/FullInvoiceModal";

const ArtisanInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [missions, setMissions] = useState([]);
  const [formData, setFormData] = useState({
    missionId: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    items: [],
    materials: [],
    laborCost: 0,
    notes: "",
    dueDate: "",
  });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleView = (id) => {
  setSelectedInvoiceId(id);
  setIsModalOpen(true);
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchInvoices();
      fetchMissions();
    }
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await apiClient.get("/api/invoices/artisan");
      setInvoices(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures");
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async () => {
    try {
      const response = await apiClient.get("/api/missions/artisan");
      setMissions(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des missions");
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/api/invoices", formData);
      setInvoices([response.data, ...invoices]);
      setShowInvoiceForm(false);
      resetForm();
      toast.success("Facture créée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création de la facture");
    }
  };

  const handleUpdateInvoice = async (invoiceId) => {
    try {
      const response = await apiClient.put(`/api/invoices/${invoiceId}`, formData);
      setInvoices(invoices.map(inv => inv._id === invoiceId ? response.data : inv));
      setShowInvoiceForm(false);
      resetForm();
      toast.success("Facture mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la facture");
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) return;
    try {
      await apiClient.delete(`/api/invoices/${invoiceId}`);
      setInvoices(invoices.filter(inv => inv._id !== invoiceId));
      toast.success("Facture supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la facture");
    }
  };

  const handleMissionSelect = (missionId) => {
    const mission = missions.find(m => m._id === missionId);
    if (mission) {
      setFormData({
        ...formData,
        missionId: mission._id,
        clientName: mission.clientName,
        clientAddress: mission.clientAddress,
        clientEmail: mission.clientEmail,
        materials: mission.materials || [],
        laborCost: mission.workDetails?.timeSpent ? (mission.workDetails.timeSpent / 60) * 50 : 0, // 50€ per hour
      });
    }
  };

  const resetForm = () => {
    setFormData({
      missionId: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      items: [],
      materials: [],
      laborCost: 0,
      notes: "",
      dueDate: "",
    });
    setSelectedInvoice(null);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Factures</h2>
              <button
                onClick={() => setShowInvoiceForm(true)}
                className="btn-primary"
              >
                <FaFileInvoice className="inline-block mr-2" />
                Nouvelle Facture
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-8">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {invoices.map((invoice) => (
                <motion.div
                  key={invoice._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="card-modern p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{invoice.invoiceNumber}</h3>
                    <span className={`badge ${
                      invoice.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-dark/70 mb-4">
                    <p><strong>Client:</strong> {invoice.clientName}</p>
                    <p><strong>Total:</strong> {invoice.total.toFixed(2)}€</p>
                    <p><strong>Date d'échéance:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                       onClick={() => handleView(invoice._id)}
                      className="btn-secondary flex-1"
                    >
                      <FaEye className="inline-block mr-2" />
                      Voir
                    </button>
                    
                  
                <FullInvoiceModal
                invoiceId={selectedInvoiceId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
                    {invoice.status === 'draft' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setFormData({
                              ...invoice,
                              missionId: invoice.missionId._id,
                            });
                            setShowInvoiceForm(true);
                          }}
                          className="btn-primary flex-1"
                        >
                          <FaEdit className="inline-block mr-2" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice._id)}
                          className="btn-primary bg-red-500 hover:bg-red-600 flex-1"
                        >
                          <FaTrash className="inline-block mr-2" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Invoice Form Modal */}
          {showInvoiceForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {selectedInvoice ? "Modifier la facture" : "Nouvelle facture"}
                </h2>
                <form onSubmit={selectedInvoice ? () => handleUpdateInvoice(selectedInvoice._id) : handleCreateInvoice}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Mission</label>
                      <select
                        value={formData.missionId}
                        onChange={(e) => handleMissionSelect(e.target.value)}
                        className="input-modern"
                        required
                      >
                        <option value="">Sélectionner une mission</option>
                        {missions.map((mission) => (
                          <option key={mission._id} value={mission._id}>
                            {mission.title} - {mission.clientName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Client</label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="input-modern"
                        placeholder="Nom du client"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse</label>
                      <input
                        type="text"
                        value={formData.clientAddress}
                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                        className="input-modern"
                        placeholder="Adresse du client"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        className="input-modern"
                        placeholder="Email du client"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Coût main d'œuvre (€)</label>
                      <input
                        type="number"
                        value={formData.laborCost}
                        onChange={(e) => setFormData({ ...formData, laborCost: Number(e.target.value) })}
                        className="input-modern"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Date d'échéance</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="input-modern"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="input-modern"
                        rows="3"
                        placeholder="Notes additionnelles"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button type="submit" className="btn-primary flex-1">
                      {selectedInvoice ? "Mettre à jour" : "Créer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInvoiceForm(false);
                        resetForm();
                      }}
                      className="btn-secondary flex-1"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanInvoices;