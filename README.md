# 🛡️ RetailShield – AI-Powered Cybersecurity for Retail

RetailShield is a secure, intelligent authentication system for retail applications that detects threats using behavioral biometrics, IP validation, and OTP transformation logic. It aims to enhance login security by learning user-specific typing patterns and flagging suspicious login attempts based on behavioral deviation or IP mismatch.

## 📦 MVP – Unique Authentication Stack

RetailShield introduces a **first-of-its-kind multi-layered authentication** system that doesn't rely solely on passwords or OTPs — it *learns* how users behave and adapts in real-time to protect against impersonation, phishing, and social engineering.

### 🔐 Key Innovations in Authentication Flow:

| Layer                        | Description |
|-----------------------------|-------------|
| 🧠 **Keystroke Biometrics** | At login, the system captures how the user types (dwell & flight times), and compares it with a trained biometric baseline using machine learning (One-Class SVM). If it doesn't match, login is flagged. |
| 🔁 **OTP Transformation Layer** | Instead of a static OTP, users receive a hint to apply a transformation (like `reverse`, `prefix_42`, or `shift_+1`) before inputting it. This defeats traditional OTP intercept or brute force attacks. |
| ❓ **Security Question Fallback** | If the biometric profile is suspicious or unknown, the system falls back to an additional security question. |
| 📊 **Compliance Score Tracking** | Every login attempt is scored in terms of biometric confidence, password strength, and suspicious patterns — giving admins insight into potential internal threats. |

> 🛡️ This unique blend of **“how you type + how you think”** makes RetailShield resilient against stolen credentials, OTP sniffing, and insider attacks — even if the attacker knows the correct password.

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



