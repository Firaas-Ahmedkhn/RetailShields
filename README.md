# 🛡️ RetailShield – AI-Powered Cybersecurity for Retail

RetailShield is a secure, intelligent authentication system for retail applications that detects threats using behavioral biometrics, IP validation, and OTP transformation logic. It aims to enhance login security by learning user-specific typing patterns and flagging suspicious login attempts based on behavioral deviation or IP mismatch.

## 🚀 Features

- ✅ Typing pattern–based behavioral biometric authentication  
- ✅ OTP transformation strategies for secure password recovery  
- ✅ IP address validation and anomaly alert system  
- ✅ Email alert on suspicious IP login attempt  
- ✅ FastAPI backend for biometric comparison  
- ✅ MERN stack frontend for smooth UI/UX

## 🧠 Problem Statement

Traditional authentication systems are vulnerable to phishing, credential theft, and brute-force attacks. Our solution introduces continuous, context-aware verification using biometrics and network data.

## 📊 Datasets Used

We use publicly available datasets for keystroke dynamics:

- **CMU Keystroke Dataset** (Carnegie Mellon University)  
  👉 [https://www.cs.cmu.edu/~keystroke/](https://www.cs.cmu.edu/~keystroke/)  
  Format includes dwell time and flight time for various users typing fixed passwords.

> If you're using a custom cleaned/preprocessed dataset, you can mention it here and optionally add a download link or `data/` folder in your repo.


## 🛠️ Tech Stack

| Component         | Technology Used                  |
|------------------|----------------------------------|
| Frontend         | React.js + Tailwind CSS          |
| Backend (API)    | Node.js, Express.js              |
| Biometric Engine | FastAPI (Python) + One-Class SVM |
| Database         | MongoDB + Mongoose               |
| Email Service    | Nodemailer (Gmail SMTP)          |
