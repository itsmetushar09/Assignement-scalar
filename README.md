# 🏗️ Project Management Tool (Trello Clone)



A Kanban-style project management web application that closely replicates Trello's design and user experience. Users can create boards, lists, and cards, organize tasks visually using drag-and-drop, and manage workflows efficiently.

## 🥁 Introduction

This platform is designed to help teams manage projects efficiently with a visually intuitive interface similar to Trello. Users can create boards for projects, organize tasks into lists and cards, track progress, and collaborate effectively.

## Key highlights:

Drag-and-drop functionality for lists and cards
Task assignment and due dates
Labels and checklist management
Search and filter options
## 💡 Inspiration

The inspiration came from the need for lightweight, visually-driven project management tools that enable teams to stay organized. Trello’s interface is clean and intuitive, and this project aims to replicate that experience while giving users the ability to manage tasks efficiently.

## 💬 What it does
Core Features:

- 1. Board Management

Create boards with a title
View boards with all lists and cards

- 2. Lists Management

Create, edit, and delete lists
Reorder lists using drag-and-drop

- 3. Cards Management

Create, edit, and delete cards
Move cards between lists using drag-and-drop
Reorder cards within a list
Add labels, due dates, checklists, and assign members



## 🎨 UI Design
- Inspired by Trello
- Smooth drag-and-drop for lists and cards
- Clean and responsive interface for desktop and mobile
- Color-coded labels and visually distinct cards
## ⚡ Challenges
- Drag & Drop Complexity: Ensuring smooth reordering of lists and cards without UI glitches
- Database Relationships: Modeling boards, lists, cards, labels, and members effectively
- Search & Filter Performance: Filtering large datasets dynamically while maintaining UI responsiveness

✅ How We Built It
- Frontend: React.js SPA with Tailwind CSS for styling and Lucide-React for icons
- Backend: Node.js + Express.js with REST APIs for boards, lists, and cards
- Database: PostgreSQL with relational modeling for boards, lists, cards, labels, members, and checklists
- State Management: React useState and context for managing UI states
- Drag & Drop: Implemented using @hello-pangea/dnd