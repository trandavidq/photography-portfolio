<<<<<<< HEAD
# Claude-Code-Experiment
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
=======
# Photography Portfolio Website

A modern photography portfolio built with Next.js 16, featuring AWS integration for image storage, DynamoDB for data management, and email-based authentication.

## Features

- 📸 Gallery management system
- 🖼️ Image upload with automatic optimization (original, optimized, thumbnail)
- ☁️ AWS S3 storage with CloudFront CDN
- 🗄️ DynamoDB database
- 🔐 2FA email authentication via AWS SES
- 🎨 Clean, minimal design with dark mode support
- ⚡ Built with Next.js 16 and Turbopack
>>>>>>> 2bdb661 (Document local dev setup)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- AWS account (for production features)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

3. Edit `.env.local` and add your AWS credentials (optional for local development):

```bash
# For local development, the app will run with placeholder values
# Add real AWS credentials when you're ready to test cloud features
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

The app will run locally even without AWS credentials configured. To use cloud features (image upload, galleries, authentication), you'll need to configure AWS services.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
