import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2, Plus, X } from "lucide-react";
import Card from "./Card";
import { api } from "../services/api";

export default function List({ list, data, setData, searchTerm }) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter cards based on search term
  const filteredCards = list.cards.filter(card => 
    card.title.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;
    try {
      const response = await api.createCard({
        list_id: list.id,
        title: newCardTitle.trim(),
      });

      const newCard = { ...response.data, id: String(response.data.id) };

      const newData = data.map((l) =>
        l.id === list.id ? { ...l, cards: [...l.cards, newCard] } : l
      );
      setData(newData);
      setNewCardTitle("");
      setIsAddingCard(false);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleDeleteList = async () => {
    setIsDeleting(true);
    try {
      await api.deleteList(list.id);
      const newData = data.filter((l) => l.id !== list.id);
      setData(newData);
    } catch (error) {
      console.error("Error deleting list:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddCard();
    if (e.key === 'Escape') {
      setIsAddingCard(false);
      setNewCardTitle("");
    }
  };

  return (
    <div className="w-[272px] bg-[#f1f2f4] rounded-xl flex flex-col max-h-[calc(100vh-100px)] text-[#172b4d] shrink-0">
      <div className="p-3 pb-2 flex justify-between items-center font-semibold text-sm group">
        <h2 className="px-2 w-full cursor-pointer">{list.title}</h2>
        <button
          onClick={handleDeleteList}
          disabled={isDeleting}
          className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
          title="Delete List"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Droppable droppableId={list.id} type="card">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-2 min-h-[10px] ${
              snapshot.isDraggingOver ? "bg-gray-200/50 rounded-lg" : ""
            }`}
          >
            {filteredCards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      card={card}
                      isDragging={snapshot.isDragging}
                      data={data}
                      setData={setData}
                      listId={list.id}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-2">
        {isAddingCard ? (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a title for this card..."
              className="w-full p-2 rounded-lg text-sm border-none shadow-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddCard}
                className="bg-[#0c66e4] hover:bg-[#0055cc] px-4 py-1.5 rounded text-white text-sm font-medium transition-colors"
              >
                Add card
              </button>
              <button
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-200 p-1.5 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 w-full p-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add a card
          </button>
        )}
      </div>
    </div>
  );
}