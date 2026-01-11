# 🚀 Frontend – Next.js Application

This is a **Next.js 14** application bootstrapped with  
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The app is built using:
- ⚛️ React + Next.js (App Router)
- 🎨 Tailwind / MUI (depending on your setup)
- 🔐 Auth flow (login API backend integration)

---

## 🧰 Prerequisites

Before running the project, ensure you have installed:
- Node.js (v18+ recommended)
- npm / yarn / pnpm / bun
- Backend API running (see backend README)

---

## 🚀 Getting Started

### 1️⃣ Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2️⃣ Environment Variables

Create `.env.local` based on `.env.example` (if provided)
Typical values:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
AUTH_REDIRECT=/dashboard
```

---

## ▶️ Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open your browser at:

👉 **http://localhost:3001**

The project will auto-refresh when you edit files.

---

## 🧪 Login Test (Required)

After running the backend & frontend:

1. Visit **/login**
  <img width="1084" height="648" alt="image" src="https://github.com/user-attachments/assets/c863a99a-6a5f-461a-a9cf-79ab660d8b45" />
2. Enter credentials (email: merdeka@mail.com & password: test1234) and You should be redirected to employee page
   <img width="1899" height="879" alt="image" src="https://github.com/user-attachments/assets/967b8814-e42b-413d-be90-b559d4012cf8" />

---

## 📚 Learn More

- Docs → https://nextjs.org/docs
- Interactive Tutorial → https://nextjs.org/learn
- GitHub → https://github.com/vercel/next.js

---

## ☁️ Deployment

Deploy easily via **Vercel**:

👉 https://vercel.com/new?utm_source=create-next-app

Or follow Next.js deploy docs:

👉 https://nextjs.org/docs/app/building-your-application/deploying

---

## 👨‍💻 Contribution

1. Create a feature branch  
2. Commit with meaningful messages  
3. Submit a pull request 🎉

---

## 📸 Required Screenshots ☑

| Feature | Screenshot Required |
|--------|---------------------|
| Login Success | ✅ Upload screenshot |
| Employee CRUD (Add/Edit/Delete) | ✅ Upload screenshot |

---

## 📜 License
MIT — free for personal and commercial use.
