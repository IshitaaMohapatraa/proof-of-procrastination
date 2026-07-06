# Proof of Procrastination™

> **A blockchain-inspired web application that records procrastination sessions using immutable hash chaining to demonstrate data integrity through an unconventional and interactive use case.**

Proof of Procrastination™ is a full-stack web application that explores blockchain-inspired concepts by treating procrastination sessions as immutable records. Every logged session generates a unique hash that references the previous entry, forming a verifiable chain capable of detecting any modification to historical data.

Developed during a creative hackathon, the project combines modern web development practices with an intentionally humorous concept to demonstrate software engineering, user experience design, state management, and data integrity principles.

---

# Live Demo

**Application:** https://dopamine-decay-drive.lovable.app

---

# Overview

Traditional productivity applications encourage users to maximize efficiency and minimize distractions.

Proof of Procrastination™ intentionally approaches the problem from the opposite perspective by documenting procrastination rather than preventing it.

Each session is transformed into an immutable block linked to the previous one using blockchain-inspired hashing principles. If any historical record is modified, the chain integrity is compromised, demonstrating the concept of tamper detection in a simple and engaging manner.

Although the application is intentionally satirical, it serves as an educational demonstration of cryptographic data structures, frontend architecture, responsive UI design, and modern web application development.

---

# Key Features

## Immutable Procrastination Chain

Each recorded session contains:

* Activity
* Duration
* Timestamp
* Mood
* Optional Notes
* Generated Hash
* Previous Block Reference

The application validates the chain and visually indicates whether its integrity has been preserved.

---

## Session Logging

Users can record procrastination activities including predefined categories and custom entries.

Examples include:

* Doomscrolling
* YouTube Spiral
* VS Code Panic
* Overthinking
* "Just Five More Minutes"

Each session supports:

* Activity selection
* Timer
* Mood tracking
* Notes
* Automatic timestamp generation

---

## Achievement System

A gamified achievement system rewards user activity with unlockable badges.

Examples:

* First Delay
* Hour Waster
* Infinite Loop
* Chronic Procrastinator
* Master of Distractions

Achievements are displayed within the user profile and can generate shareable summary cards.

---

## Wrapped Summary

Inspired by annual digital activity summaries, the application generates personalized reports including:

* Total procrastination time
* Most frequent activity
* Peak procrastination period
* Session statistics

These summaries are designed to be exported and shared.

---

## Certificate Generator

Generate a downloadable certificate summarizing:

* Total recorded procrastination
* Root chain hash
* Verification summary

---

## Theme Support

The application supports multiple interface themes.

* Dark Mode
* Light Mode

User preferences persist across sessions.

---

# 🏗 System Architecture

```text
                        User
                          │
                          ▼
                  React + TypeScript
                          │
               React Router + State
                          │
                          ▼
                     Supabase Auth
                          │
                          ▼
                  PostgreSQL Database
                          │
                          ▼
               Session & Block Storage
                          │
                          ▼
              Hash Generation & Validation
                          │
                          ▼
             Immutable Procrastination Chain
```

---

# Technology Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

## Backend

* Supabase

## Database

* PostgreSQL

## Authentication

* Supabase Authentication

## Deployment

* Lovable Hosting

---

# Technical Highlights

* Blockchain-inspired immutable data model
* Hash-based chain validation
* Responsive user interface
* Component-based React architecture
* Interactive dashboard
* Gamification through achievements
* Shareable "Wrapped" summaries
* Theme persistence
* Supabase authentication and cloud database integration

---

# Project Structure
```text
src/
├── assets/
├── components/
├── contexts/
├── hooks/
├── lib/
├── pages/
├── services/
├── utils/
├── App.tsx
└── main.tsx
```
---

# Getting Started

Clone the repository

```bash
git clone https://github.com/IshitaaMohapatraa/proof-of-procrastination.git
```

Navigate to the project directory

```bash
cd proof-of-procrastination
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# Learning Outcomes

This project provided practical experience in:

* Designing component-based React applications
* State management and data flow
* Responsive interface development
* Blockchain-inspired hashing concepts
* Data integrity validation
* Authentication and database integration using Supabase
* Building interactive dashboards
* Creating reusable UI components
* Modern frontend development with TypeScript

---

# Future Enhancements

Potential improvements include:

* Real SHA-256 cryptographic implementation
* Cloud synchronization across multiple devices
* Progressive Web App (PWA) support
* Advanced analytics and data visualization
* Public profile sharing
* Friend leaderboards
* Exportable chain history
* Mobile application
* Real-time synchronization using Supabase subscriptions

---

# Disclaimer

Proof of Procrastination™ was developed as part of a creative hackathon. The project intentionally applies software engineering concepts to a humorous use case to demonstrate frontend architecture, backend integration, cryptographic data structures, and interactive user experience design.

While the concept is satirical, the implementation reflects practical software development principles and serves as an exploration of how technical systems can be applied in unconventional contexts.

---

# License

This project is intended for educational, portfolio, and demonstration purposes.

---

# Author

**Ishita Mohapatra**

If you found this project interesting, feel free to explore the repository, provide feedback, or connect with me.

