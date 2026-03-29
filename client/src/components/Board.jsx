import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import List from "./List";
import { api } from "../services/api";

export default function Board({ searchTerm }) {
  const [data, setData] = useState([]);
  const [boardId] = useState("44958488-2e0b-4e22-9e2c-532618358fae");
  const [newListTitle, setNewListTitle] = useState("");
  const [showListInput, setShowListInput] = useState(false);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await api.getBoard(boardId);
        const { lists, cards } = response.data;

        const formattedData = lists
          .sort((a, b) => a.position - b.position)
          .map((list) => ({
            ...list,
            id: String(list.id),
            cards: cards
              .filter((card) => card.list_id === list.id)
              .sort((a, b) => a.position - b.position)
              .map((card) => ({ ...card, id: String(card.id) })),
          }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching board:", error);
      }
    };
    fetchBoard();
  }, [boardId]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // REORDER LISTS
    if (type === "list") {
      const newLists = Array.from(data);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      setData(newLists);

      try {
        const payload = newLists.map((list, index) => ({
          id: list.id,
          position: index + 1,
        }));
        await api.reorderLists({ lists: payload });
      } catch (error) {
        console.error("Failed to reorder lists", error);
      }
      return;
    }

    // REORDER CARDS
    const sourceListIndex = data.findIndex((l) => l.id === source.droppableId);
    const destListIndex = data.findIndex((l) => l.id === destination.droppableId);

    const sourceList = data[sourceListIndex];
    const destList = data[destListIndex];

    const sourceCards = Array.from(sourceList.cards);
    const destCards =
      source.droppableId === destination.droppableId
        ? sourceCards
        : Array.from(destList.cards);

    const [removedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, removedCard);

    const newData = [...data];
    newData[sourceListIndex] = { ...sourceList, cards: sourceCards };

    if (source.droppableId !== destination.droppableId) {
      newData[destListIndex] = { ...destList, cards: destCards };
    }

    setData(newData);

    try {
      if (source.droppableId === destination.droppableId) {
        const payload = destCards.map((c, index) => ({
          id: c.id,
          position: index + 1,
        }));
        await api.reorderCards({ cards: payload });
      } else {
        await api.moveCard(draggableId, { newListId: destination.droppableId });
        const payload = destCards.map((c, index) => ({
          id: c.id,
          position: index + 1,
        }));
        await api.reorderCards({ cards: payload });
      }
    } catch (error) {
      console.error("Failed to move/reorder card", error);
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const response = await api.createList({ board_id: boardId, title: newListTitle });
      const newList = {
        ...response.data,
        id: String(response.data.id),
        cards: [],
      };
      setData([...data, newList]);
      setNewListTitle("");
      setShowListInput(false);
    } catch (error) {
      console.error("Failed to create list", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddList();
    if (e.key === 'Escape') {
      setShowListInput(false);
      setNewListTitle("");
    }
  };

  return (
    <div className="p-4 h-full overflow-x-auto flex flex-col">
      <header className="text-white font-bold text-xl mb-4 py-2">
        Trello Clone Board
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex items-start gap-4 h-full"
            >
              {data.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`h-full ${snapshot.isDragging ? "opacity-75" : ""}`}
                    >
                      <List 
                        list={list} 
                        data={data} 
                        setData={setData} 
                        searchTerm={searchTerm} 
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add New List Container */}
              <div className="min-w-[272px] shrink-0">
                {showListInput ? (
                  <div className="bg-[#f1f2f4] p-2 rounded-xl flex flex-col gap-2 shadow-sm">
                    <input
                      type="text"
                      autoFocus
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="p-2 rounded-md w-full text-sm border-2 border-blue-500 outline-none"
                      placeholder="Enter list title..."
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddList}
                        className="bg-[#0c66e4] hover:bg-[#0055cc] px-4 py-1.5 rounded text-white text-sm font-medium transition-colors"
                      >
                        Add list
                      </button>
                      <button
                        onClick={() => {
                          setShowListInput(false);
                          setNewListTitle("");
                        }}
                        className="text-gray-500 hover:text-gray-800 hover:bg-gray-200 p-1.5 rounded transition-colors"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowListInput(true)}
                    className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl flex items-center gap-2 font-medium transition-colors"
                  >
                    <Plus size={20} /> Add another list
                  </button>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}