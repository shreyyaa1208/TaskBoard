📋 Task Board Application


A simple, responsive task management app built with React + TypeScript that supports boards, columns (lists), and tasks (cards).
It includes drag-and-drop functionality, filtering, local persistence, and a polished UI.

🚀 Features


🗂 Board View


Create new boards

View all boards in a tabular format

Navigate to detailed board view

📌 Board Detail


Create, edit, delete columns (lists)


Create, edit, delete tasks (cards)

Tasks have:

Title

Description

Priority (high, medium, low)

Creator name

Due date

🔍 Filtering & Search


Search tasks by title or description

Filter tasks by:

Priority

Due date (Today, This week, Overdue)

🧲 Drag & Drop


Reorder tasks within a column

Move tasks between columns

Dropzones for accurate positioning

💾 Persistence
All data is saved in localStorage

No backend required

📱 Responsive Design
Fully mobile-friendly


Horizontal scroll for columns


Clean layout across devices

🧪 Validation & UX

Required fields (title, priority)

Inline form validation

Delete confirmation modals for tasks, columns, boards

🛠 Tech Stack


React (with Hooks)

TypeScript

HTML5 

CSS Modules

React Router DOM

LocalStorage for data persistence

Context for state Management

📂 Folder Structure


bash


Copy code


src/


├── components/


│   ├── Board/


│   ├── Column/


│   ├── Task/


│   └── Common/


├── contexts/         # App state (Context + Reducer)


├── pages/            # BoardView and BoardDetail


├── types/            # TypeScript interfaces


├── utils/            # Local storage helpers


├── styles/           # Global + variables.css


📦 Installation & Setup





Copy code


git clone https://github.com/your-username/task-board-app.git


cd task-board-app


npm install


npm start


🌐 Live Demo


✅ View Deployed App on Vercel - [task-board-alpha-five.vercel.app](https://task-board-alpha-five.vercel.app/)

🧠 Developer Notes
Focus was on UI/UX and functionality

Drag & drop is native (no external libs like react-beautiful-dnd)

Filtering is lightweight but powerful

Easily extendable to add backend or auth


✅ Assignment Requirements Checklist

Requirement	Status


Create boards	✅


Create, edit, delete columns	✅


Create, edit, delete tasks	✅


Task priority, due date, creator	✅


Drag & drop tasks	✅


Reorder tasks within column	✅


Search/filter tasks	✅


Fully responsive UI	✅


LocalStorage data persistence	✅


Validation and confirmation modals	✅

 Author
Shreya Singour
Frontend-focused developer 
