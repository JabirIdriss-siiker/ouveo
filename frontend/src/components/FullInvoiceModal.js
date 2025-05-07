import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { ClipLoader } from "react-spinners";
import apiClient from "../api/apiClient";

const FullInvoiceModal = ({ invoiceId, isOpen, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!invoiceId || !isOpen) return;

    setLoading(true);
    apiClient
      .get(`/api/invoices/${invoiceId}`)
      .then((res) => {
        setInvoice(res.data);
      })
      .catch((err) => console.error("Erreur chargement facture", err))
      .finally(() => setLoading(false));
  }, [invoiceId, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-3xl w-full bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-2xl font-semibold mb-4">
            Détails de la facture
          </Dialog.Title>
          <button className="absolute top-3 right-4" onClick={onClose}>✕</button>

          {loading ? (
            <div className="flex justify-center p-10"><ClipLoader /></div>
          ) : invoice ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">Client</h3>
                <p>{invoice.clientName}</p>
                <p>{invoice.clientEmail}</p>
              </div>

              <div>
                <h3 className="font-bold">Mission</h3>
                <p>{invoice.missionId?.title}</p>
                <p>{invoice.missionId?.description}</p>
              </div>

              {invoice.missionId?.bookingId && (
                <div>
                  <h3 className="font-bold">Réservation</h3>
                  <p>{invoice.missionId.clientAddress}</p>
                  <p>{new Date(invoice.missionId.startDate).toLocaleDateString()} - {new Date(invoice.missionId.completionDate).toLocaleDateString()} </p>
                </div>
              )}

              <div>
                <h3 className="font-bold">Facturation</h3>
                <p><strong>Main d'œuvre:</strong> {invoice.laborCost}€</p>
                <p>
                  <strong>Matériaux:</strong>{" "}
                  {invoice.materials.map((m) => `${m.name} (${m.price}€)`).join(", ")}
                </p>
                <p><strong>Total:</strong> {invoice.total.toFixed(2)}€</p>
                <p><strong>Échéance:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                <p><strong>Statut:</strong> {invoice.status}</p>
              </div>

              {invoice.notes && (
                <div>
                  <h3 className="font-bold">Notes</h3>
                  <p>{invoice.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p>Facture non trouvée</p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FullInvoiceModal;
