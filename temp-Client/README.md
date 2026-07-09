# UnityBlood

**🔐 Admin Panel Credentials**

- **👤 Username:** aaaa.ahshanhabib@gmail.com
- **🔑 Password:** 123123As

**🔗 Live Site URL:** [UnityBlood](https://blood-donation-47e0d.web.app/)

---

## ✨ About UnityBlood

UnityBlood is a platform dedicated to bridging the gap between blood donors and recipients. The website is designed to make blood donation accessible, efficient, and community-driven.

## 🌟 Features

- **👤 Donor Registration**: Users can register as donors by providing their blood type, location, and contact details.
- **⚡ Recipient Requests**: Users in need of blood can submit requests specifying the required blood type, urgency, and location.
- **🔍 Search Functionality**:
  - Find nearby donors based on location and blood type.
  - Filter results by availability and last donation date.
- **📚 Admin Dashboard**:
  - Manage donor and recipient data.
  - Approve or decline donation requests.
  - Monitor website analytics and user activity.
- **⚠ Alerts**: Notification system for successful events or errors.
- **🎓 Blood Bank Directory**: A comprehensive directory with contact information and availability status.
- **🔒 Secure User Authentication**:
  - Role-based access control (donors, volunteers, and admins).
  - Data encryption for security.
- **⏳ Donation History**: Donors can track their previous donations.
- **🌟 Community Features**:
  - Testimonials from donors and recipients.
  - Blogs and resources about blood donation.
- **📱 Mobile-Friendly Design**: Fully responsive UI optimized for all devices.

## 📝 Installation

To set up the project locally, follow these steps:

### ⚡ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest stable version)
- [Git](https://git-scm.com/)
- [Vite](https://vitejs.dev/)

### 🛠️ Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/.git
   cd UnityBlood-client-a12-mod
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env.local` file in the root directory and add the following variables:
     ```env
     VITE_apiKey=your_firebase_api_key
     VITE_authDomain=your_firebase_auth_domain
     VITE_projectId=your_firebase_project_id
     VITE_storageBucket=your_firebase_storage_bucket
     VITE_messagingSenderId=your_firebase_messaging_sender_id
     VITE_appId=your_firebase_app_id
     VITE_IMAGE_HOSTING_KEY=your_image_hosting_key
     VITE_Payment_Gateway_PK=your_payment_gateway_public_key
     ```

4. **Run the development server:**

   ```sh
   npm run dev
   ```

5. **Open the application** in your browser:
   ```
   http://localhost:5173
   ```

## ⚙️ Configuration

- **🔥 Firebase**: Ensure your Firebase project is set up and linked correctly using the environment variables.
- **💳 Payment Gateway**: Configure Stripe for secure transactions.
- **🖼️ Image Hosting**: Set up an image hosting service if required.

## 🛠️ Usage

- Register as a donor and provide necessary details.
- Search for blood donors or submit a recipient request.
- Use the admin dashboard to manage users and requests.
- Stay informed with alerts, donation history, and community posts.

## 💻 Tech Stack

### 📺 Frontend:

- **React** `^18.3.1`
- **React Router** `^7.1.1`
- **React Icons** `^5.4.0`
- **SweetAlert2** for alerts `^11.15.10`
- **Tailwind CSS** `^3.4.17`
- **DaisyUI** `^4.12.23`

### 🌐 Backend & Services:

- **Firebase** for authentication and database `^11.2.0`
- **Axios** for API requests `^1.7.9`
- **React Hook Form** `^7.54.2`
- **Date-fns** for date management `^4.1.0`
- **Jodit-React** for text editing `^5.0.10`
- **Stripe API** for payments (`@stripe/react-stripe-js`, `@stripe/stripe-js`)

### 🔧 Development Tools:

- **Vite** `^6.0.5`
- **ESLint** for code linting
- **PostCSS** & **Autoprefixer** for styling
