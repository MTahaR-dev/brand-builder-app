# 🎨 BrandBuilder AI

> AI-powered brand asset generator that visualizes your product across Billboard, Newspaper, and Social Media formats — powered by Google Gemini.

---

## 📌 Overview

**BrandBuilder AI** is a web application that takes a product description and automatically generates consistent, high-fidelity marketing visuals for three mediums:

| Medium | Aspect Ratio | Use Case |
|--------|-------------|----------|
| 🏙️ Billboard | 16:9 | Outdoor advertising, wide-format displays |
| 📰 Newspaper | 4:3 | Print media, editorial placements |
| 📱 Social Media | 1:1 | Instagram, Facebook, digital campaigns |

The app uses a **multi-step AI pipeline**:
1. Generates a detailed **Visual Identity / Style Guide** for your product
2. Creates **medium-specific image prompts** based on the style guide
3. Renders **photorealistic AI images** for each format using Gemini's image generation model

All three outputs maintain a **consistent visual identity** — same product, same materials, same aesthetic across every format.

---

## ✨ Features

- 🤖 **Multi-step Gemini AI pipeline** — style guide → prompt engineering → image generation
- 🖼️ **3 marketing formats** generated simultaneously — Billboard, Newspaper, Social
- 🎨 **Consistent brand identity** — all visuals share the same product design language
- ⬇️ **Download high-res assets** directly from the UI
- ⚡ **Real-time status updates** while assets are being generated
- 🌙 **Sleek dark UI** built with Tailwind CSS and Framer Motion animations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 + TypeScript | Frontend framework |
| Vite 6 | Build tool & dev server |
| Google Gemini API (`gemini-2.5-flash-image`) | AI image generation |
| Google Gemini API (`gemini-2.5-flash`) | Style guide & prompt generation |
| Tailwind CSS 4 | Styling |
| Framer Motion | UI animations |
| Lucide React | Icons |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MTahaR-dev/brand-builder-app.git
   cd brand-builder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then open `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to `http://localhost:3000`

---

## 🎮 How to Use

1. Enter a **detailed product description** in the sidebar (e.g. *"A premium glass water bottle with a bamboo cap, minimalist design, targeted at eco-conscious consumers"*)
2. Click **"Generate Assets"**
3. Wait while the AI:
   - Builds your visual identity
   - Composes marketing scenes
   - Renders images for each medium
4. View and **download** your Billboard, Newspaper, and Social Media assets

---

## 📁 Project Structure

```
brand-builder-app/
├── src/
│   ├── App.tsx          # Main application component & Gemini API logic
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment variables template
└── .gitignore           # Git ignore rules
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `APP_URL` | Deployment URL (auto-injected in AI Studio) | ❌ Optional |

> ⚠️ **Never commit your `.env.local` file or expose your API key publicly.**

---

## 🌐 Live Demo

This app was originally built and deployed on [Google AI Studio](https://ai.studio/apps/3be3830c-2891-470a-b371-c20a20f1e983).

---

## 📜 License

This project is licensed under the **Apache 2.0 License** — see the [LICENSE](LICENSE) file for details.

---

## ScreenShots

<img width="1437" height="695" alt="Image1" src="https://github.com/user-attachments/assets/962dbd5b-2037-4e1d-a306-a640559ca4c3" />
<img width="1445" height="712" alt="Image2" src="https://github.com/user-attachments/assets/741b5c19-f328-486c-a7cf-072fe5f6c2a8" />

---

## 👤 Author

**Muhammad Taha Rashid**
- GitHub: [@MTahaR-dev](https://github.com/MTahaR-dev)
- LinkedIn: [muhammad-taha-rashid](https://www.linkedin.com/in/muhammad-taha-rashid-408416283/)

---

*Built as part of the Google AI Professional Certificate — AI for App Building course.*
