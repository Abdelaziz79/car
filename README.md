# Car Maintenance System 🚗

[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0088CC?style=flat-square&logo=react&logoColor=white)](https://reactnative.dev/)

A comprehensive mobile application built with Expo/React Native for tracking and managing vehicle maintenance tasks. Keep your vehicle in top condition by monitoring maintenance schedules, costs, and history.

## Table of Contents

- [Car Maintenance System 🚗](#car-maintenance-system-)
  - [Table of Contents](#table-of-contents)
  - [📱 App Preview](#-app-preview)
  - [✨ Features](#-features)
    - [Task Management 📋](#task-management-)
    - [Dashboard \& Analytics 📊](#dashboard--analytics-)
    - [Organization \& Records 🗂️](#organization--records-️)
    - [Customization \& Localization 🌐](#customization--localization-)
  - [🛠️ Technical Stack](#️-technical-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [📁 Project Structure](#-project-structure)
  - [🤝 Contributing](#-contributing)
  - [📝 License](#-license)
  - [📧 Contact](#-contact)
  - [🙏 Acknowledgments](#-acknowledgments)

## 📱 App Preview

[Add screenshots or GIFs showcasing key features]

## ✨ Features

### Task Management 📋

- Create and manage custom maintenance tasks
- Support for multiple maintenance types:
  - Time-based maintenance (daily, weekly, monthly)
  - Distance-based maintenance (kilometer/mileage tracking)
- Complete task management with cost tracking, odometer readings, and detailed notes

### Dashboard & Analytics 📊

- Comprehensive dashboard with upcoming tasks and vehicle statistics
- Detailed cost analysis and maintenance tracking
- Interactive maintenance heatmap and historical data visualization
- Statistical breakdowns by maintenance type, tags, and time periods

### Organization & Records 🗂️

- Advanced tag-based categorization system
- Dual view modes (standard and compact)
- Complete maintenance history with data export/import (CSV)
- Detailed task completion records

### Customization & Localization 🌐

- Bilingual interface (English 🇺🇸 and Arabic 🇸🇦)
- RTL layout support
- Customizable settings and preferences
- Dark/light theme support

## 🛠️ Technical Stack

- **Core Framework**: Expo/React Native
- **Programming**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router (file-based)
- **Data Storage**: AsyncStorage
- **UI Interactions**: React Native Gesture Handler
- **Design**: Responsive with theme support

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/car-maintenance-app.git
cd car-maintenance-app
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npx expo start
```

4. Launch on platform:

- Press `a` - Android
- Press `i` - iOS
- Press `w` - Web

## 📁 Project Structure

```
car-maintenance-app/
├── app/                    # Application screens
│   ├── (stats)/           # Statistics screens
│   ├── index.tsx          # Home screen
│   ├── add.tsx            # Add task screen
│   ├── all-tasks.tsx      # Tasks list screen
│   └── settings.tsx       # Settings screen
├── components/            # Reusable components
├── constants/             # App constants
├── data/                  # Static data and defaults
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── utils/                 # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name - @yourtwitter - email@example.com

Project Link: https://github.com/yourusername/car-maintenance-app

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All contributors who have helped this project grow
