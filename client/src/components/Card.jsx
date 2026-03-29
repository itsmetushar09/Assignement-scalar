import React, { useState } from "react";
import { AlignLeft, CheckSquare, Trash2, X, CreditCard } from "lucide-react";
import { api } from "../services/api";

export default function Card({ card, isDragging, data, setData, listId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCard = async () => {
    setIsDeleting(true);
    try {
      await api.deleteCard(card.id);
      const newData = data.map((list) => {
        if (list.id === listId) {
          return { ...list, cards: list.cards.filter((c) => c.id !== card.id) };
        }
        return list;
      });
      setData(newData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting card:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!title.trim()) return; 
    setIsSaving(true);
    try {
      const response = await api.updateCard(card.id, { title, description });
      const newData = data.map((list) => {
        if (list.id === listId) {
          const updatedCards = list.cards.map((c) =>
            c.id === card.id
              ? { ...c, title: response.data.title, description: response.data.description }
              : c
          );
          return { ...list, cards: updatedCards };
        }
        return list;
      });
      setData(newData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`bg-white rounded-lg shadow-sm mb-2 p-3 text-sm cursor-pointer border-b border-gray-300 hover:border-[#0c66e4] group relative
        ${isDragging ? "rotate-2 shadow-xl ring-2 ring-blue-400" : ""}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCard();
          }}
          className="absolute top-2 right-2 p-1 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </button>

        {card.label && <div className="w-10 h-2 bg-green-500 rounded-full mb-2"></div>}
        <p className="text-[#172b4d] break-words pr-6">{card.title}</p>

        <div className="flex items-center gap-3 mt-2 text-gray-500">
          {card.description && <AlignLeft size={14} title="This card has a description" />}
          {card.checklist && (
            <div className="flex items-center gap-1 text-xs">
              <CheckSquare size={12} />
              <span>0/3</span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 overflow-y-auto">
          <div className="bg-[#f1f2f4] w-full max-w-2xl rounded-xl shadow-2xl relative mb-20 text-[#172b4d]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-8">
                <CreditCard size={24} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xl font-semibold bg-transparent border-2 border-transparent hover:bg-gray-200 focus:bg-white focus:border-blue-500 rounded px-2 py-1 outline-none transition-all"
                  />
                  <p className="text-sm text-gray-500 px-2 mt-1">
                    In list <span className="underline cursor-pointer">Current List</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <AlignLeft size={24} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a more detailed description..."
                    className="w-full min-h-[120px] bg-gray-200 hover:bg-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg p-3 outline-none resize-y transition-all"
                  />
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleSaveDetails}
                      disabled={isSaving}
                      className="bg-[#0c66e4] hover:bg-[#0055cc] text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="hover:bg-gray-200 px-4 py-2 rounded font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-300">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Actions</h4>
                <button
                  onClick={handleDeleteCard}
                  disabled={isDeleting}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-red-100 hover:text-red-700 w-full sm:w-auto px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} /> {isDeleting ? "Deleting..." : "Delete Card"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}