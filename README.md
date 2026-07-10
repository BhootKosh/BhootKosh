# BhootKosh

**The illustrated archive of Indian ghosts, spirits, demons, haunted places, and folklore.**

BhootKosh is a production-ready full-stack Next.js application: a public folklore encyclopedia plus a secure admin dashboard with real PostgreSQL-backed CRUD, media uploads, public submissions, and SEO.

This project is **100% original**. It is inspired only by the general idea of an illustrated folklore database—not by any third-party design, text, layout, branding, or assets.

## Tech stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS**
- **MongoDB** (Atlas) + **Prisma**
- **Auth.js** (NextAuth v5) credentials auth
- **Zod** + **React Hook Form**
- **TipTap** rich text
- **Cloudinary** image uploads
- Deployable on **Vercel**

## Features

### Public site

- Homepage with featured content and CTAs
- Ghost encyclopedia with search, filters, sort, pagination
- Ghost detail pages with related spirits and SEO
- Regions, types, haunted places, folklore stories
- Random spirit redirect
- Public “Submit a legend” form (admin review only)
- Contact form with rate limiting
- Dynamic metadata, sitemap, robots.txt

### Admin dashboard (`/admin`)

- Secure login / logout (bcrypt + session)
- Stats dashboard
- Full CRUD: ghosts, haunted places, stories, regions, tags
- Media library (Cloudinary)
- Submission review: approve, reject, delete, convert to ghost/story
- Draft / publish workflow

## Prerequisites

- Node.js 20+
- MongoDB database (MongoDB Atlas recommended)
- Optional: Cloudinary account (for image uploads)

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/bhootkosh?retryWrites=true&w=majority"
AUTH_SECRET="paste-a-long-random-string"
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@bhootkosh.com"
ADMIN_PASSWORD="ChangeMeSecurePassword123!"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_FOLDER="bhootkosh"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database

Push the Prisma schema to MongoDB and seed sample content:

```bash
npx prisma db push
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default admin credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` (seeded).

## MongoDB Atlas tips

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Database user + password
3. Network Access → allow your IP (or `0.0.0.0/0` for development)
4. Connect → Drivers → copy URI, add database name `bhootkosh` in the path

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Prisma schema to MongoDB |
| `npm run db:seed` | Seed admin + sample content |
| `npm run db:studio` | Prisma Studio |

## Seed data

The seed creates:

- Admin user
- Indian regions
- Tags
- **15 ghosts** (Chudail, Vetala, Pishacha, Nishi Daak, Brahmadaitya, Yakshini, Daayan, Munjya, Nagin, Preta, Rakshasa, Mohini Yakshi, Pei, Bhoot, Shakchunni)
- **5 haunted places** (Bhangarh Fort, Kuldhara, Dumas Beach, Dow Hill, Shaniwar Wada)
- **5 stories**
- 1 sample pending submission

## Cloudinary setup

1. Create a free Cloudinary account
2. Copy cloud name, API key, and API secret into `.env`
3. Uploads work from **Admin → Media** and from form image uploaders

Without Cloudinary, the rest of the app works; media upload returns a clear error.

## Security notes

- Admin routes and `/api/admin/*` are protected by Auth.js middleware
- Passwords hashed with bcrypt
- Zod validation on forms and APIs
- Rate limits on login, submissions, and contact
- Image type + size validation (JPEG/PNG/WebP/GIF, 5MB)
- Rich text sanitized on render (DOMPurify)
- Secrets stay server-side (never expose Cloudinary secret or `DATABASE_URL` to the client)

## Deployment (Vercel)

1. Push the repo to GitHub
2. Create a Vercel project from the repo
3. Add all env vars (production `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, Cloudinary, `NEXT_PUBLIC_SITE_URL`)
4. Set `DATABASE_URL` to your MongoDB Atlas URI (with database name in the path)
5. Push schema and seed against production:

```bash
npx prisma db push
npm run db:seed
```

6. Deploy

For multi-instance rate limiting, replace the in-memory limiter in `lib/rate-limit.ts` with Upstash Redis or similar.

## Project structure

```txt
app/
  (public)/          # Public pages
  admin/             # Admin dashboard
  api/               # Route handlers
components/
  public/ admin/ ui/
lib/                 # prisma, auth, cloudinary, validators, seo…
prisma/              # schema + seed
```

## Cultural disclaimer

BhootKosh is an educational folklore archive. Legends vary by region, language, and community. Entries are not scientific claims. Haunted-place material is cultural narrative—not travel or safety advice. Some topics (e.g. witchcraft accusations) are documented carefully because folklore can intersect with real-world harm.

## License

Private / all rights reserved unless otherwise stated by the project owner.
