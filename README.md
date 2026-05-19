# ClauseGuard - AI-Powered Legal Contract Analysis

A modern SaaS application that uses AI to analyze legal contracts for risks, benchmark against industry standards, and provide an interactive AI chat copilot.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Document Upload & Processing**: Upload PDF/DOCX files for AI analysis
- **Risk Scoring**: Get 0-100 risk scores with severity levels
- **Clause Analysis**: Break down contracts into analyzable clauses
- **Industry Benchmarking**: Compare against standard legal practices
- **Key Date Extraction**: Automatically identify deadlines and milestones
- **AI Copilot Chat**: Ask questions about your contracts using RAG
- **Export Reports**: Generate PDF reports of analysis results

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Framer Motion |
| **Backend** | Next.js API Routes, Supabase (PostgreSQL + pgvector) |
| **AI/ML** | Groq (Llama 3.1/3.3), Google Gemini (Embeddings) |
| **Deployment** | Vercel |
| **Database** | Supabase |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- Supabase account
- Groq API key
- Google AI API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Groq API Key - Get from https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Google AI Studio API Key - Get from https://aistudio.google.com
GOOGLE_API_KEY=your_google_api_key_here

# Supabase Configuration - Get from https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Installation

```bash
# Clone the repository
git clone https://github.com/shehz-max/Clause-Guard.git

# Navigate to project directory
cd Clause-Guard

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000
```

### Database Setup

1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/` in order:
   - `001_enable_pgvector.sql` - Enable pgvector extension
   - `002_create_tables.sql` - Create database tables
   - `003_create_functions.sql` - Create search functions
   - `004_update_vector_dim.sql` - Update vector dimensions
   - `005_tier1_features.sql` - Additional features
   - `006_update_rpc_dims.sql` - RPC function updates

3. Seed the knowledge base by visiting:
   ```
   POST /api/knowledge-base/status
   ```

## Project Structure

```
clauseguard/
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Dashboard pages
│   │   │   ├── dashboard/      # Contract list
│   │   │   ├── contract/[id]/  # Contract detail
│   │   │   ├── upload/         # Upload page
│   │   │   └── settings/       # Settings page
│   │   ├── (marketing)/        # Marketing pages
│   │   │   └── page.tsx        # Landing page
│   │   ├── api/               # API routes
│   │   │   ├── analyze/        # Analysis endpoint
│   │   │   ├── chat/           # Chat endpoint
│   │   │   ├── upload/         # Upload endpoint
│   │   │   └── knowledge-base/ # KB sync
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── analysis/          # Analysis components
│   │   ├── chat/             # Chat components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # UI components
│   │   └── upload/           # Upload components
│   └── lib/
│       ├── analysis/          # Analysis modules
│       ├── knowledge-base/    # KB data
│       ├── parsers/          # Document parsers
│       ├── rag/              # RAG pipeline
│       └── supabase/         # Supabase client
├── supabase/
│   └── migrations/           # Database migrations
├── knowledge-base/           # Legal knowledge data
└── public/                  # Static assets
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload document for analysis |
| `/api/analyze` | POST | Trigger analysis for document |
| `/api/chat` | POST | Chat with AI copilot |
| `/api/knowledge-base/status` | GET | Get KB status |
| `/api/knowledge-base/status` | POST | Sync knowledge base |

## How It Works

1. **Upload**: User uploads a PDF or DOCX file
2. **Parse**: Document is parsed and text is extracted
3. **Chunk**: Text is split into manageable chunks
4. **Embed**: Chunks are converted to vector embeddings
5. **Analyze**: AI analyzes each chunk for risks, clauses, etc.
6. **Score**: Overall risk score is calculated
7. **Store**: Results are stored in Supabase
8. **Chat**: User can ask questions using RAG

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Built by Muhammad Umer

## Acknowledgments

- [Groq](https://groq.com) - LLM API
- [Google Gemini](https://ai.google.dev) - Embeddings
- [Supabase](https://supabase.com) - Database & Auth
- [Vercel](https://vercel.com) - Hosting