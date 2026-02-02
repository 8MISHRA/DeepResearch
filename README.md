# DeepResearch - React Migration

A modern React application showcasing real-world system design concepts, migrated from vanilla HTML/CSS/JS to React with Vite.

## 🚀 Live Demo

**Production URL:** [https://fazil-khan03.github.io/DeepResearch/](https://fazil-khan03.github.io/DeepResearch/)

## 📋 Features

- **Idempotency Key Concepts**: Interactive simulation demonstrating double-payment prevention
- **Low-Level Design Framework**: Step-by-step guide for mastering LLD interviews
- **Interactive Visualizations**: Chart.js powered data visualizations
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Hash routing for GitHub Pages compatibility
- **Chart.js** - Data visualization
- **TailwindCSS** - Utility-first CSS framework

## 💻 Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/fazil-khan03/DeepResearch.git
cd DeepResearch

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch.

**Setup Steps:**

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push your code to the `main` branch
5. The workflow will automatically build and deploy

### Option 2: Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains your production build
# You can deploy this folder to any static hosting service
```

## 📁 Project Structure

```
DeepResearch/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx          # Reusable sidebar navigation
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Idempotency.jsx       # Idempotency concepts with simulation
│   │   └── LowLevelDesign.jsx    # LLD framework guide
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── dist/                         # Production build (generated)
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions deployment
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
└── package.json                 # Dependencies and scripts
```

## 🔗 Routes

The application uses hash routing for GitHub Pages compatibility:

- `/` - Home page
- `/#/idempotency` - Idempotency Key concepts
- `/#/low-level-design` - Low-Level Design framework

## 🎨 Key Features by Page

### Idempotency Page
- Interactive payment simulation (with/without idempotency keys)
- Real-time logging and state management
- Chart.js visualizations for retry success rates
- Company implementation comparisons (Stripe, Airbnb, Uber)
- Architecture flow diagrams with hover tooltips

### Low-Level Design Page
- Multi-step interactive framework
- Requirements gathering game
- Entity selection with SQL schema preview
- UML class diagram visualization
- Design pattern code examples (Factory, Strategy, Singleton)
- Time allocation pie chart

## 📝 Migration Notes

This project was migrated from vanilla HTML/CSS/JS to React while preserving:
- ✅ 100% of UI and styling
- ✅ All interactive features and animations
- ✅ Chart.js visualizations
- ✅ TailwindCSS styling
- ✅ Responsive design

**Key Changes:**
- Converted from multi-page HTML to single-page React app
- Implemented hash routing for GitHub Pages compatibility
- Modularized code into reusable React components
- Improved state management with React hooks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Content synthesized from engineering blogs of:
- Stripe
- Uber
- Airbnb

---

**Built with ❤️ using React and Vite**
