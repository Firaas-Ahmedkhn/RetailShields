# 🛡️ RetailShield – AI-Powered Cybersecurity for Retail

RetailShield is a secure, intelligent authentication system for retail applications that detects threats using behavioral biometrics, IP validation, and OTP transformation logic. It aims to enhance login security by learning user-specific typing patterns and flagging suspicious login attempts based on behavioral deviation or IP mismatch.

## 🧪 Key Features

| Feature                        | Description                                               |
|-------------------------------|-----------------------------------------------------------|
| ✅ Keystroke Biometrics       | Validates user identity based on typing behavior          |
| 🔐 OTP Transformation         | User-defined rules like reverse, prefix_42, shift +1/-1   |
| ❓ Security Question Fallback | Triggered if biometric behavior seems suspicious          |
| 📬 Email Alerts               | For suspicious logins, lockouts, or password changes      |
| 🚫 Lockout System             | Locks users for 24 hrs after 3 failed logins              |
| 📊 Compliance Score           | Risk-based scoring to monitor employee behavior           |
| 🧠 AI Comparison Engine       | ML model predicts biometric authenticity (valid/suspicious/rejected) |


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


## 🚀 Real- life Context
In the past few years, cybersecurity has shifted focus — from purely technical threats to exploiting human weaknesses.

 -🔐 In 2022, Uber was hacked by a teenager using stolen employee credentials obtained via social engineering.
 -🎰 In 2023, MGM Resorts lost over $100 million after one successful helpdesk scam gave attackers internal access.

These weren’t software bugs — they were employee-side vulnerabilities.

## This is where Retail Shield comes in: a behavioral security platform that uses keystroke biometrics, multi-layered authentication, and real-time risk monitoring to protect your employees from becoming your weakest link.

## 💡 Why This Matters for Retail

Big-box retailers like Walmart or Costco have:

- Thousands of employees with login access  
- Repetitive passwords and shared devices  
- Limited cyber awareness training  

🔓 These make retail teams vulnerable to phishing, credential stuffing, and social engineering.  
Retail Shield stops attackers, even if they have the correct password.

## 🎥 Live Demo Flow

> 🔴 Real-Time Walkthrough

1. 👤 Login with email + password  
2. 🧠 Biometric profile compared to stored baseline  
3. ⚠️ If behavior is suspicious → redirect to security question  
4. 📩 Send OTP with hint to apply transformation  
5. 🧮 User inputs transformed OTP  
6. 🔐 New password is set (if applicable)  
7. 📊 Compliance score logged + shown in dashboard

## 🤖 Example Use Cases

- 🚫 Stop phishing: OTP + keystroke + behavioral detection  
- 🔍 Audit employees: Real-time compliance score  
- 🧠 Detect fraud: Catch impersonators even with correct credentials

## 📊 Compliance Score Breakdown

| Factor                  | Points |
|-------------------------|--------|
| Biometric Match         | +50    |
| Accepted Policy Terms   | +20    |
| Password Entered        | +10    |
| (Optional) Strong Password | +20 |
| ⚠️ Suspicious Activity  | -50    |

## 🧠 Future Enhancements

- ✅ Admin dashboard to view risk levels & history  
- 📊 Charts for biometric trends  
- 📱 Mobile biometric input  
- 🛡️ Multi-factor authentication with WebAuthn

## Production Guide
 - Client -> npm install | npm run dev
 - Server -> npm install | npm run dev
 - Backend ->  pip install -r requirements.txt | uvicorn main:app --reload --port 8000
   
## NOTE
The website shown at the start of the video was just for pitching the idea and explaining how it's different from others.

🔗 You can check out the live website here: [retailshield-smart-auth.vercel.app](https://retailshield-smart-auth.vercel.app/)

## 🤝 Let’s Collaborate

Got feedback? Want to use this in your company?  
📬 retailshield864@gmail.com



