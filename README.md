# 🚀 Excuse Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license) [![Issues](https://img.shields.io/github/issues/yourusername/excuse-generator.svg)](https://github.com/danielaprimacov/excuses-generator/issues) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

> **Generate the perfect excuse for any situation!** Choose a scenario, pick a tone, and get a witty, humorous excuse in seconds.

---

## 🌟 Features

- 🎲 **Excuse Generation**: Select a situation (and optionally a role or tone) to receive a custom, humorous excuse.
- 📨 **User Requests**: Submit requests to add, edit, or delete excuses for admin approval.
- 🔒 **Admin Dashboard**: Secure interface to manage, filter, and curate the excuses database.
- 📧 **Email Notifications**: Automatic emails notify the admin of new user requests.

---

## 🎨 Demo

<details>  
<summary>Click to view screenshots / live demo</summary>

![Home Page Screenshot](link-to-screenshot.png)  
![Admin Dashboard Screenshot](link-to-screenshot.png)

> Live Demo: [excuse-generator.example.com](https://nopify.netlify.app)

</details>

---

## 🛠️ Tech Stack

| Frontend     | Styling     | Routing      | Email Service      |
| ------------ | ----------- | ------------ | ------------------ |
| React + Vite | CSS Modules | React Router | SendGrid / Mailgun |

---

## ⚙️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/danielaprimacov/excuses-generator.git
   cd excuses-generator
   ```
2. **Install dependencies**

   ```bash
     git clone https://github.com/danielaprimacov/excuses-generator.git
     cd excuses-generator
   ```

3. **Set up environment**

   ```
   Copy .env.example to .env and fill in your keys.
   ```

4. **Run locally**

   ```
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**

   ```
   npm run build
   npm run preview
   ```

## 📁 Project Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   └── pages/              # Route components
├── pages/                  # Top-level route handlers / API endpoints
│   ├── api.js
│   └── auth.js
├── utils/                  # Utility functions (API calls, auth)
│   ├── api.js
│   └── auth.js
├── .env                    # Environment variables
├── index.html              # App HTML template
├── main.jsx                # React entry point
├── App.jsx                 # Root React component
├── vite.config.js          # Vite configuration
├── package.json            # Project metadata & scripts
└── package-lock.json       # Locked dependency versions
```

## 🔧 Environment Variables

| Key                 | Description                           |
| ------------------- | ------------------------------------- |
| `VITE_API_URL`      | Base URL of your backend API          |
| `VITE_ADMIN_KEY`    | Secret key for admin dashboard access |
| `EMAIL_SERVICE_KEY` | API key for SendGrid/Mailgun          |

**Example `.env`:**

```env
VITE_API_URL=https://api.yoursite.com
VITE_ADMIN_KEY=supersecretadminkey
EMAIL_SERVICE_KEY=SG.xxxxxxx
```

## 🛡️ Admin Interface

1. **Access the Dashboard**  
   Visit `/admin?key=<YOUR_ADMIN_KEY>` in your browser.

2. **Manage Excuses**

   - Review all existing excuses
   - Filter by category or status
   - Add new excuses manually
   - Edit or delete any excuse

3. **Handle User Requests**
   - View pending add/edit/delete requests
   - Approve or reject each request
   - Trigger email notifications upon decision

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add some feature"

   ```

4. Push to your branch
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a Pull Request on GitHub

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
