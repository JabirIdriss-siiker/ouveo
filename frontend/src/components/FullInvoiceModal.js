import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { ClipLoader } from "react-spinners";
import apiClient from "../api/apiClient";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "Non défini";

const Section = ({ title, children }) => (
  <div>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <div className="text-sm text-gray-700">{children}</div>
  </div>
);

const FullInvoiceModal = ({ invoiceId, isOpen, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!invoiceId || !isOpen) return;

    setLoading(true);
    setError("");
    apiClient
      .get(`/api/invoices/${invoiceId}`)
      .then((res) => setInvoice(res.data))
      .catch((err) => {
        console.error("Erreur chargement facture", err);
        setError("Impossible de charger la facture.");
      })
      .finally(() => setLoading(false));
  }, [invoiceId, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative max-w-3xl w-full bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-2xl font-semibold mb-6">
            Détails de la facture
          </Dialog.Title>
          <button
            className="absolute top-4 right-5 text-xl hover:text-red-500"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>

          {loading ? (
            <div className="flex justify-center p-10">
              <ClipLoader />
            </div>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : invoice ? (
            <div className="space-y-6 text-sm">
              <Section title="Client">
                <p>{invoice.clientName || "Nom indisponible"}</p>
                <p>{invoice.clientEmail || "Email indisponible"}</p>
              </Section>

              <Section title="Mission">
               <p><strong>Titre :</strong> {invoice.missionId?.title || "Titre indisponible"}</p>
               <p><strong>Raison :</strong> {invoice.missionId?.bookingId?.reason || "Aucune raison fournie"}</p>
             </Section>

              {invoice.missionId?.bookingId && (
                <Section title="Réservation">
                  <p>{invoice.missionId.clientAddress || "Adresse non précisée"}</p>
                  <p>
                    {formatDate(invoice.missionId.startDate)} -{" "}
                    {formatDate(invoice.missionId.completionDate)}
                  </p>
                </Section>
              )}

              <Section title="Facturation">
                <p><strong>Main d'œuvre:</strong> {invoice.laborCost}€</p>
                <p>
                  <strong>Matériaux:</strong>{" "}
                  {invoice.materials?.length
                    ? invoice.materials
                        .map((m) => `${m.name} (${m.price}€)`)
                        .join(", ")
                    : "Aucun"}
                </p>
                <p><strong>Total:</strong> {invoice.total?.toFixed(2)}€</p>
                <p><strong>Échéance:</strong> {formatDate(invoice.dueDate)}</p>
                <p><strong>Statut:</strong> {invoice.status}</p>
              </Section>

              {invoice.notes && (
                <Section title="Notes">
                  <p>{invoice.notes}</p>
                </Section>
              )}
            </div>
          ) : (
            <p className="text-center">Facture non trouvée</p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FullInvoiceModal;
