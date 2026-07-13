# UnityBlood Repository Architecture & Data Audit

> Source basis: client and server source files in this repository, inspected July 14, 2026. This is a code-level audit; it does not query the production database.

## Important storage clarification

The app **does not use Cloud Firestore**. `firebase` is initialized in `Client/firebase.config.js` and Firebase Authentication is used by `Client/src/providers/AuthProvider.jsx`. Application records are stored by the Express API in MongoDB database `unity_blood` (`Server/index.js`). MongoDB document fields are not enforced by a schema/ODM here, and there are no database-level foreign keys.

## 1. MongoDB collections and inferred schemas

Every document also receives MongoDB's `_id: ObjectId` on insertion.

### `users` (the donor/user record)

Created from the registration page and stored through `POST /users`.

| Field | Type | Source / meaning |
| --- | --- | --- |
| `name` | string | Registration; profile-updateable |
| `email` | string | Registration; checked for uniqueness by the API, but no MongoDB unique index is declared |
| `bloodGroup` | string | Registration; profile-updateable |
| `district` | string | Registration; profile-updateable |
| `upazilla` | string | Registration; profile-updateable |
| `role` | string | Initially `Donor`; admins can set `Volunteer`, `Admin`, or `Donor` |
| `status` | string | Initially `Active`; admins can set status (UI uses `Blocked` and `Active`) |
| `image` | string (URL) | Uploaded to ImgBB, then stored; profile-updateable |
| `createdAt` | Date | Assigned by `POST /users` on the server |

### `DonationRequests`

Created from the Create Donation Request form and stored through `POST /createDonationRequest`.

| Field | Type | Source / meaning |
| --- | --- | --- |
| `requesterPhoto` | string (URL), optional | Firebase user's `photoURL` at request creation |
| `requesterEmail` | string | Firebase user's email; logical reference to `users.email` |
| `requesterName` | string | Firebase user's display name |
| `district`, `upazilla` | string | Recipient location |
| `hospital`, `recipientName`, `fullAddress`, `message` | string | Request form details |
| `bloodGroup` | string | Required blood group |
| `date`, `time` | string | Requested date and time (form values, not server Date objects) |
| `donationStatus` | string | Initially `pending`; later `inprogress`, `done`, or `canceled` |
| `createdAt` | Date | Assigned by `POST /createDonationRequest` on the server |
| `donorName`, `donorEmail` | string, optional | Added only when the status update payload uses `inprogress` |

`PATCH /requestUpdate/:id` only updates `bloodGroup`, `date`, `district`, `fullAddress`, `hospital`, `message`, `recipientName`, `time`, and `upazilla`; it does not update requester or donor identity fields.

### `blogs`

Created from the admin/dashboard blog form through `POST /createBlog`.

| Field | Type | Source / meaning |
| --- | --- | --- |
| `title` | string | Blog title |
| `thumbnailUrl` | string (URL) | ImgBB upload URL |
| `content` | string (HTML/rich text) | Jodit editor value |
| `status` | string | Initially `draft`; update handler supports `draft` and `published` |

The server does not add `createdAt`, author, or other fields for blogs.

### `payments`

Recorded only after a Stripe PaymentIntent has succeeded, through `POST /payments`.

| Field | Type | Source / meaning |
| --- | --- | --- |
| `name`, `email` | string | Current Firebase user display name/email |
| `amount` | number | User-entered donation amount |
| `transactionId` | string | Stripe PaymentIntent ID |
| `date` | Date | Browser-side `new Date()` at recording time |

## 2. Collection relationships

These are logical application relationships, not MongoDB foreign keys or validated references.

| From | Relationship | To | Evidence |
| --- | --- | --- | --- |
| `users.email` | requester creates/owns request | `DonationRequests.requesterEmail` | Create request payload; list endpoints filter by `requesterEmail` |
| `users.email` | accepted donor on request | `DonationRequests.donorEmail` | Optional `inprogress` status payload |
| `users.name` | display identity | `DonationRequests.requesterName` / optional `donorName` | Payload carries copied name values, not IDs |
| `users.role` | authorization decision | admin endpoints and `AdminRoute` | Server `verifyAdmin` checks `users.role === "Admin"` |
| Firebase Auth user | profile record | `users.email` | A Firebase account and MongoDB user document are created separately and joined by email |
| `payments.email` | probable payer identity (inferred) | `users.email` | Same email is copied into payment payload; API does not enforce the relationship |

`blogs` has no modeled relationship to another collection. Payments have no enforced user reference and no request reference.

## 3. CRUD ownership: donors/users and donation requests

### Donors (`users`)

| CRUD | Client owner | API endpoint / server handler | Access behavior |
| --- | --- | --- | --- |
| Create | `Pages/Registration/Registration.jsx` → `handleRegister` | `POST /users` in `Server/index.js` | Public; server rejects missing email and returns success without insertion when email already exists |
| Read one | `AuthProvider.jsx`, `Pages/Shared/Profile.jsx`, `Pages/Dashboard/CreateDonation.jsx` | `GET /user?email=` | JWT required; endpoint itself does not compare requested email with JWT email |
| Read list | `hooks/useAllUsers.jsx`; Search and All Users consume it | `GET /allUsers` | JWT required; no server admin middleware, so every authenticated caller can retrieve all users |
| Update profile | `Pages/Shared/Profile.jsx` → `handleRegister` | `PATCH /user-update/:id` | JWT required; handler does not verify record ownership |
| Update role/status | `Pages/Dashboard/AllUsers.jsx` | `PATCH /user-update/role/:id`, `PATCH /user-update/status/:id` | Role change is JWT + admin; status change is JWT only |
| Delete | None | None | No user-delete route or client action exists |

### Donation requests (`DonationRequests`)

| CRUD | Client owner | API endpoint / server handler | Access behavior |
| --- | --- | --- | --- |
| Create | `Pages/Dashboard/CreateDonation.jsx` → `handleSubmit` | `POST /createDonationRequest` | JWT required; UI blocks a locally fetched user whose status is `Blocked`, but server does not repeat this check |
| Read public pending | `Pages/PendingDonationRequests.jsx/PendingDonationRequests.jsx` | `GET /pending-donation-requests` | Public; returns pending requests newest first |
| Read one | `Pages/DonationRequestsDetails/DonationRequestsDetails.jsx`, `Pages/Dashboard/EditRequest.jsx` | `GET /donationRequest/:id` | JWT required |
| Read requester's list | `Pages/Dashboard/MyDonationRequests.jsx`, dashboard home | `GET /donationRequests?email=`, `GET /allDonationRequests?email=` | JWT required; server does not confirm query email equals JWT email |
| Read all | `hooks/useAllDonationRequests.jsx` | `GET /allDonationRequestsAd` | JWT required but not server-admin protected |
| Update details | `Pages/Dashboard/EditRequest.jsx` → `handleSubmit` | `PATCH /requestUpdate/:id` | JWT required; no owner/admin check |
| Update lifecycle | `MyDonationRequests`, `AllDonationRequests`, `DashboardHome`, `DonationRequestsDetails` | `PATCH /request-status-update/:id` | JWT required; can set `done`, `canceled`, or `inprogress` plus donor identity |
| Delete | `AllDonationRequests`, `MyDonationRequests`, `DashboardHome` → `handleDelete` | `DELETE /requestDelete/:id` | JWT + `verifyAdmin` required; non-admin UI calls will receive 403 |

## 4. Representative CRUD snippets

### Create donor/user — client (`Client/src/Pages/Registration/Registration.jsx`)

```js
const newUser = {
  name: form.name.value, email: form.email.value,
  bloodGroup: form.bloodGroup.value, district: district.name,
  upazilla: form.upazilla.value, role: "Donor", status: "Active",
  image: response.data.data.display_url,
};
createUser(newUser.email, form.password.value).then(async () => {
  updateProfileInfo(newUser.name, newUser.image);
  await axiosPublic.post("/users", newUser);
});
```

The Firebase account is created first; the server then adds `createdAt` and inserts the MongoDB user record.

### Read/list donors — client (`Client/src/hooks/useAllUsers.jsx`)

```js
useEffect(() => {
  axiosSecure.get("/allUsers").then((res) => {
    const sortedUsers = [...(res.data || [])].sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    setAllUsers(sortedUsers);
  });
}, [axiosSecure]);
```

This calls the JWT-protected server route `GET /allUsers`, whose server implementation is `usersCollection.find().sort({ createdAt: -1, _id: -1 }).toArray()`.

### Update donor profile — server (`Server/index.js`)

```js
app.patch("/user-update/:id", verifyToken, async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updateDoc = { $set: {
    name: req.body.name, bloodGroup: req.body.bloodGroup,
    district: req.body.district, upazilla: req.body.upazilla,
    image: req.body.image,
  }};
  res.send(await usersCollection.updateOne(query, updateDoc));
});
```

The client caller is `Profile.handleRegister` in `Client/src/Pages/Shared/Profile.jsx`.

### Delete donation request — server (`Server/index.js`)

```js
app.delete("/requestDelete/:id", verifyToken, verifyAdmin, async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  res.send(await requestsCollection.deleteOne(query));
});
```

The client calls this as `axiosSecure.delete(\`/requestDelete/${id}\`)` in `Client/src/Pages/Dashboard/AllDonationRequests.jsx` (and also in dashboard/home request lists).

## 5. Folder structure

Generated dependencies and package lockfiles are omitted.

```text
UnityBlood/
├── Client/
│   ├── public/                 # static logo and Vite asset
│   ├── src/
│   │   ├── assets/             # images and Lottie animations
│   │   ├── data/               # Bangladesh district/upazilla data
│   │   ├── hooks/              # Axios, auth/admin, data-fetching hooks
│   │   ├── Layout/             # main public layout
│   │   ├── Pages/
│   │   │   ├── Dashboard/      # requests, users, blogs, profile dashboard views
│   │   │   ├── Home/           # home sections, login, funding/payment
│   │   │   ├── Shared/         # navbar, footer, profile, loading/error UI
│   │   │   ├── Registration/   # signup page
│   │   │   ├── Search/         # donor search
│   │   │   ├── DonationRequestsDetails/
│   │   │   ├── PendingDonationRequests.jsx/
│   │   │   └── PublishedBlogs/
│   │   ├── providers/          # AuthProvider and ThemeProvider
│   │   ├── Routes/             # router, private/admin guards
│   │   ├── index.css
│   │   └── main.jsx
│   ├── firebase.config.js
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── firebase.json
├── Server/
│   ├── index.js                # Express API, MongoDB, JWT, Stripe
│   ├── package.json
│   ├── render.yaml
│   ├── vercel.json
│   └── README.md
└── REPOSITORY_ARCHITECTURE_AUDIT.md
```

## 6. Main pages and features

| Area | Pages / features |
| --- | --- |
| Public | Home, FAQ, contact/supporter/testimonial sections, donor search, pending requests, published blogs |
| Authentication | Registration with profile image upload, Firebase email/password login, logout, protected navigation |
| Donor/profile | View/edit donor profile, location and blood-group search filters |
| Donation requests | Create request, detail view, edit, own-request list, status changes, public pending list |
| Dashboard | Summary/home, profile, request management, user management, settings, funding chart |
| Administration/content | All users, user role and status management, all requests, blog drafts/publication, add blog |
| Funding | Stripe card-payment flow, payment recording, funding lists/chart |

Routes are defined in `Client/src/Routes/Routes.jsx`; dashboard routes are protected by `PrivateRoute`, while `/dashboard/all-users` additionally uses `AdminRoute`.

## 7. Technology stack and dependencies

### Client runtime dependencies

| Package | Purpose |
| --- | --- |
| `react`, `react-dom` | UI runtime and browser rendering |
| `react-router-dom` | Client-side routing and navigation guards |
| `firebase` | Firebase app initialization and email/password authentication |
| `axios` | API, ImgBB upload, and secure HTTP clients |
| `@tanstack/react-query` | Server-state fetching/caching for selected lists |
| `react-hook-form` | Login form handling/validation |
| `@stripe/react-stripe-js`, `@stripe/stripe-js` | Stripe card collection and payment confirmation |
| `jodit-react` | Rich-text blog editor |
| `recharts` | Dashboard funding chart |
| `date-fns` | Date formatting |
| `sweetalert2` | Modal feedback and confirmations |
| `lottie-react` | Lottie animation rendering |
| `animate.css`, `aos` | CSS/scroll animations |
| `react-icons` | Icon components |
| `@fortawesome/react-fontawesome`, `@fortawesome/free-brands-svg-icons`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-solid-svg-icons` | Font Awesome React icons and icon sets |

### Client development dependencies

| Package | Purpose |
| --- | --- |
| `vite`, `@vitejs/plugin-react` | Development server and React build tooling |
| `eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` | JavaScript/React linting configuration |
| `tailwindcss`, `daisyui`, `postcss`, `autoprefixer` | Utility CSS, component styles, and CSS processing |
| `@types/react`, `@types/react-dom` | React TypeScript type definitions (despite this app using JSX) |

### Server dependencies

| Package | Purpose |
| --- | --- |
| `express` | HTTP API routing and middleware |
| `mongodb` | MongoDB driver and `ObjectId` support |
| `jsonwebtoken` | Server-issued JWT creation and verification |
| `cors` | Cross-origin request policy |
| `dotenv` | Environment-variable loading |
| `stripe` | Server-side PaymentIntent creation |
| `serverless-http` | Express adapter for serverless hosting |
| `nodemon` | Development-time server restart utility |

## 8. Authentication and authorization flow

1. The client initializes Firebase from environment variables in `Client/firebase.config.js`.
2. Registration calls Firebase `createUserWithEmailAndPassword`, updates the Firebase profile display name/photo, then posts the donor record to the public `POST /users` endpoint.
3. Login calls Firebase `signInWithEmailAndPassword` in `Pages/Home/Login/Login.jsx`.
4. `AuthProvider` subscribes to `onAuthStateChanged`. On a signed-in Firebase user it posts `{ email }` to `POST /jwt`; the Express server signs that payload with `ACCESS_TOKEN_SECRET` for one hour.
5. The client stores the returned token as `access-token` in `localStorage`. `useAxiosSecure` attaches it as `Authorization: Bearer <token>` on requests.
6. Server `verifyToken` validates that JWT before protected endpoint handlers run. `PrivateRoute` separately gates UI routes based on Firebase auth state.
7. `useAdmin` calls `GET /user/admin/:email`; the server compares path email with JWT email, looks up `users.email`, and returns whether `role === "Admin"`. `AdminRoute` uses that result. Server `verifyAdmin` repeats the database role check for the request-delete and user-role-update endpoints.

### Material limitations visible in source

- `POST /jwt` is public and signs a JWT using the request body's email without verifying a Firebase ID token. A caller who knows an email can request a token for it; this is a critical authentication weakness.
- Several JWT-protected endpoints do not check that the requested document/email belongs to the JWT subject. Examples: `GET /user?email=`, both requester-list endpoints, `PATCH /user-update/:id`, and request detail/status/edit endpoints.
- `GET /allUsers`, `GET /allDonationRequestsAd`, and `PATCH /user-update/status/:id` are protected by a token but do not use server `verifyAdmin`.
- The UI prevents a `Blocked` user from creating a request, but `POST /createDonationRequest` does not enforce that restriction server-side.
- JWTs are retained in `localStorage`, which exposes them to script injection/XSS if such a vulnerability is introduced.
