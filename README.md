# SampleFlow - Creator Product Sample Request Platform

A web app that lets creators request product samples from brands. Built with Next.js and Firebase. Handles requests, approvals, and shipping tracking in real-time.

## 🚀 Features

- **Creator Dashboard**: Browse products and request samples
- **Brand Dashboard**: Manage and approve/reject sample requests
- **Real-time Tracking**: Live status updates with shipping tracking
- **Firebase Integration**: Cloud Firestore for real-time data synchronization
- **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **Status Pages**: Detailed tracking pages for each request

## 📋 Prerequisites

You'll need:

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **Firebase Account** (for database)
- **Git** (for cloning the repository)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd creator-product-sample-request
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using bun:
```bash
bun install
```

### 3. Firebase Setup

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

#### 3.2 Enable Firestore Database

1. In Firebase Console, navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (or production mode with custom rules)
4. Select a location for your database
5. Click **Enable**

#### 3.3 Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to sample_requests collection
    match /sample_requests/{requestId} {
      allow read, write: if true;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish** to save the rules

#### 3.4 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the web icon (`</>`) to add a web app
4. Register your app and copy the Firebase configuration

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Example:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDW0CCJm9C1uoKz-fvJh11aR3K1_54nwuM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=n8ntesting-476309.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=n8ntesting-476309
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=n8ntesting-476309.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=828115164859
NEXT_PUBLIC_FIREBASE_APP_ID=1:828115164859:web:2ca2c14fe564bea7aa139e
```

## 🏃 How to Run the Project

### Development Mode

Start the development server:

```bash
npm run dev
# or
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## 📁 Project Structure

```
creator-product-sample-request/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── brand/
│   │   │   └── page.tsx       # Brand dashboard
│   │   └── status/
│   │       ├── page.tsx        # Status search page
│   │       └── [id]/
│   │           └── page.tsx   # Individual request status page
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── ProductCard.tsx
│   │   ├── RequestForm.tsx
│   │   └── Navbar.tsx
│   ├── context/               # React context providers
│   │   └── request-context.tsx # Request state management
│   ├── lib/                   # Utility functions
│   │   ├── firebase.ts        # Firebase configuration
│   │   └── utils.ts
│   └── visual-edits/          # Visual editing tools
├── public/                    # Static assets
├── firestore.rules           # Firestore security rules
├── .env.local                # Environment variables (not in git)
├── package.json
└── README.md
```

## 📚 API Documentation

### Firebase Firestore Collections

#### Collection: `sample_requests`

Stores all sample request data.

**Document Structure:**
```typescript
{
  id: string;                    // Request ID (e.g., "REQ-1001")
  creatorName: string;           // Creator's full name
  email: string;                 // Creator's email address
  channelLink: string;           // Creator's channel/profile URL
  productId: string;             // Product ID (e.g., "PROD-001")
  status: "pending" | "approved" | "rejected";
  trackingLink: string | null;   // URL to tracking page
  trackingNumber?: string | null; // Shipping tracking number
  carrier?: string | null;       // Shipping carrier name
  shippingStatus?: "label_created" | "preparing_shipment" | "in_transit" | "out_for_delivery" | "delivered" | null;
  createdAt: Timestamp | string; // Request creation timestamp
}
```

### API Methods (via RequestContext)

#### `addRequest(data)`

Creates a new sample request.

**Parameters:**
```typescript
{
  creatorName: string;
  email: string;
  channelLink: string;
  productId: string;
}
```

**Returns:** `Promise<SampleRequest>`

**Example:**
```typescript
const { addRequest } = useRequests();

await addRequest({
  creatorName: "John Doe",
  email: "john@example.com",
  channelLink: "https://youtube.com/@johndoe",
  productId: "PROD-001"
});
```

#### `updateRequestStatus(id, status)`

Updates the status of a sample request.

**Parameters:**
- `id: string` - Request ID
- `status: "pending" | "approved" | "rejected"`

**Returns:** `Promise<void>`

**Example:**
```typescript
const { updateRequestStatus } = useRequests();

await updateRequestStatus("REQ-1001", "approved");
```

#### `updateShippingStatus(id, shippingStatus)`

Updates the shipping status of an approved request.

**Parameters:**
- `id: string` - Request ID
- `shippingStatus: "label_created" | "preparing_shipment" | "in_transit" | "out_for_delivery" | "delivered"`

**Returns:** `Promise<void>`

**Example:**
```typescript
const { updateShippingStatus } = useRequests();

await updateShippingStatus("REQ-1001", "in_transit");
```

#### `getRequestById(id)`

Retrieves a request by its ID.

**Parameters:**
- `id: string` - Request ID

**Returns:** `SampleRequest | undefined`

**Example:**
```typescript
const { getRequestById } = useRequests();

const request = getRequestById("REQ-1001");
```

### Real-time Subscriptions

Uses Firestore's `onSnapshot` to sync data across clients in real-time. When a request status changes, all connected clients see the update immediately.

**Collection Query:**
```typescript
const colRef = collection(db, "sample_requests");
const q = query(colRef, orderBy("createdAt", "desc"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  // Handle real-time updates
});
```

## 🔧 Configuration

### Firebase Configuration

Firebase is configured in `src/lib/firebase.ts`. The configuration is loaded from environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Firestore Rules

Security rules are in `firestore.rules`. For production, you'll want to add:

- Authentication checks
- Role-based permissions (creator vs brand)
- Field validation

## 🎨 UI Components

Uses [shadcn/ui](https://ui.shadcn.com/) components (Radix UI + Tailwind CSS). Components are in `src/components/ui/`.








