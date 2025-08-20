# 🎬 Movie Recommendations App

A Next.js + TypeScript app for browsing movies, managing favorites and watchlists, and discovering recommendations powered by TMDB.  

Authentication is handled by **NextAuth.js** (GitHub OAuth by default). State is managed with **Zustand**, styled with **TailwindCSS**, and tested with **Jest**

---

## 🚀 Features
- 🔐 Authentication via NextAuth.js  
- 🎥 Personalized movie recommendations  
- 📂 Favorites & watchlist state (Zustand)  
- 📊 Infinite scrolling rows for genres/trending  
- 🧪 Jest unit tests 
- ⚡ Optimized with Next.js App Router & RSC  

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14+ (App Router)  
- **Language**: TypeScript  
- **Auth**: NextAuth.js  
- **State**: Zustand  
- **Styling**: TailwindCSS  
- **Testing**: Jest, React Testing Library  
- **API**: TMDB  

---

## ⚙️ Getting Started

### 1. Clone and install
```bash
git clone https://github.com/your-org/movie-recs-app.git
cd movie-recs-app
npm install
```

### 2. Environment Variables
Create .env.local

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# OAuth (GitHub default)
GITHUB_ID=your_client_id
GITHUB_SECRET=your_client_secret

# TMDB
TMDB_API_KEY=your_tmdb_api_key
```

Generate a secret

```bash
openssl rand -base64 32
```

### 3. Run dev server
```bash
npm run dev
```

## 🧪 Testing

### Unit and Integration Testing
```bash
npm run test
```

## 🤝 Contributing
- Fork
- Branch: git checkout -b feat/your-feature
- Commit: git commit -m "Add feature"
- Push & open PR


