import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Sidebar from "../components/SideBar";
import {jwtDecode} from "jwt-decode";
import apiClient from "../api/apiClient";
import { FaFileInvoice, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import FullInvoiceModal from "../components/FullInvoiceModal";

const ArtisanInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", artisanSiret: "" });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
  missionId: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  artisanSiret: "",      // <— on ajoute ici
  items: [],
  materials: [],
  laborCost: 0,
  notes: "",
  dueDate: "",
});

  // Decode token to get artisan info including SIRET
  useEffect(() => {
  const init = async () => {
    try {
      const { data: user } = await apiClient.get("/api/auth/me");
      console.log("🔥 getMe user.artisanSiret:", user.artisanSiret);
      setUserInfo({ 
    name:          user.name,
    email:         user.email,
    artisanSiret:  user.artisanSiret
  });
      setFormData(fd => ({ ...fd, artisanSiret: user.artisanSiret }));
      await Promise.all([fetchInvoices(), fetchMissions()]);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de récupérer les infos artisan");
    } finally {
      setLoading(false);
    }
  };
  init();
  console.log("Fromdata after init", formData);
}, []);

  const fetchInvoices = async () => {
    try {
      const res = await apiClient.get("/api/invoices/artisan");
      setInvoices(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures");
    }
  };

  const fetchMissions = async () => {
    try {
      const res = await apiClient.get("/api/missions/artisan");
      setMissions(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des missions");
    }
  };

  const handleMissionSelect = (missionId) => {
    const mission = missions.find(m => m._id === missionId);
    if (mission) {
      setFormData(prev => ({
        ...prev,
        missionId,
        clientName: mission.clientName,
        clientAddress: mission.clientAddress,
        clientEmail: mission.bookingId?.customerEmail,
        materials: mission.materials || [],
        artisanSiret: prev.artisanSiret,
        laborCost: mission.workDetails?.timeSpent ? (mission.workDetails.timeSpent / 60) * 50 : 0,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      missionId: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      artisanSiret: userInfo.artisanSiret,
      items: [],
      materials: [],
      laborCost: 0,
      notes: "",
      dueDate: "",
    });
    setSelectedInvoice(null);
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/api/invoices", formData);
      setInvoices([res.data, ...invoices]);
      setShowInvoiceForm(false);
      resetForm();
      console.log("📤 Payload Invoice:", formData);
      toast.success("Facture créée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création de la facture");
    }
  };

  const handleUpdateInvoice = async (invoiceId) => {
    e.preventDefault();
    try {
      const res = await apiClient.put(`/api/invoices/${invoiceId}`, formData);
      setInvoices(invoices.map(inv => inv._id === invoiceId ? res.data : inv));
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
      const response = await apiClient.delete(`/api/invoices/${invoiceId}`);
      console.log("🗑️ delete response:", response.data);  
      setInvoices(invoices.filter(inv => inv._id !== invoiceId));
      toast.success("Facture supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la facture");
    }
  };

  const handleView = (id) => {
    setSelectedInvoiceId(id);
    setIsModalOpen(true);
  };

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestion des Factures</h2>
            <button onClick={() => { setShowInvoiceForm(true); resetForm(); }} className="btn-primary">
              <FaFileInvoice className="inline mr-2" />
              Nouvelle Facture
            </button>
          </motion.div>

          {/* Invoice Cards */}
          {loading ? (
            <div className="flex justify-center py-8"><ClipLoader size={40} color="var(--primary)" /></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {invoices.map(inv => (
                <motion.div key={inv._id} initial="hidden" animate="visible" variants={fadeInUp} className="card-modern p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-semibold">{inv.invoiceNumber}</h3>
                    <span className={`badge ${
                      inv.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      inv.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>{inv.status}</span>
                  </div>
                  <p><strong>SIRET :</strong> {inv.artisanSiret || "N/A"}</p>
                  <p><strong>Client :</strong> {inv.clientName}</p>
                  <p><strong>Total :</strong> {inv.total.toFixed(2)}€</p>
                  <p><strong>Dû le :</strong> {new Date(inv.dueDate).toLocaleDateString()}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleView(inv._id)} className="btn-secondary flex-1"><FaEye className="inline-block mr-2" />Voir</button>
                    {inv.status === 'draft' && (
                      <>
                        <button onClick={() => { setSelectedInvoice(inv); setFormData({ ...inv, artisanSiret: userInfo.siret }); setShowInvoiceForm(true); }} className="btn-primary flex-1"><FaEdit className="inline-block mr-2" />Modifier</button>
                        <button onClick={() => handleDeleteInvoice(inv._id)} className="btn-primary bg-red-500 flex-1"><FaTrash className="inline-block mr-2" />Supprimer</button>
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
                <h2 className="text-xl font-bold mb-4">{selectedInvoice ? 'Modifier la facture' : 'Nouvelle facture'}</h2>
                <form onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}>
                  <div className="space-y-4">
                    {/* Mission selector */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Mission</label>
                      <select
                        value={formData.missionId}
                        onChange={(e) => handleMissionSelect(e.target.value)}
                        className="input-modern"
                        required
                      >
                        <option value="">Sélectionner une mission</option>
                        {missions.map(m => (
                          <option key={m._id} value={m._id}>{m.title} - {m.clientName}</option>
                        ))}
                      </select>
                    </div>

                    {/* SIRET (read-only) */}
                    <input
   type="text"
   name="artisanSiret"
   value={formData.artisanSiret}
   onChange={(e) => setFormData({ ...formData, artisanSiret: e.target.value })}
   readOnly
   className="input-modern bg-gray-100"
 />

                    {/* Client info */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom client</label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="input-modern"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse client</label>
                      <input
                        type="text"
                        value={formData.clientAddress}
                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                        className="input-modern"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email client</label>
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        className="input-modern"
                        required
                      />
                    </div>

                    {/* Labor cost & due date */}
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
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <button type="submit" className="btn-primary flex-1">
                      {selectedInvoice ? 'Mettre à jour' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowInvoiceForm(false); resetForm(); }}
                      className="btn-secondary flex-1"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Full Invoice Modal */}
          <FullInvoiceModal
            invoiceId={selectedInvoiceId}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtisanInvoices;
