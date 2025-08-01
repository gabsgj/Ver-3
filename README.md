# WhyBot Chat Application

A modern chat application powered by Google's Gemini AI that provides both technical assistance and creative responses in the style of famous historical figures.

## Features

- 🤖 AI-powered chat with Gemini 2.5 Pro/Flash
- 💻 Technical programming assistance with code examples
- 🎭 Creative responses in the style of famous figures (Shakespeare, Einstein, etc.)
- 💬 Real-time chat interface
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **AI**: Google Gemini API
- **Database**: PostgreSQL (with Drizzle ORM)
- **Deployment**: Render

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd whybot-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## Deployment to Render

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment config"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**
   In your Render service settings, add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `DATABASE_URL`: Your PostgreSQL database URL (optional for demo)

### Option 2: Manual Setup

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `whybot-chat-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Your Gemini API key
   - `DATABASE_URL`: Your PostgreSQL database URL (optional)

4. **Deploy**
   Click "Create Web Service"

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes | - |
| `DATABASE_URL` | PostgreSQL connection string | No* | In-memory storage |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |

*Required in production if you want persistent data storage

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your environment variables

## Database Setup (Optional)

For persistent data storage, you can set up a PostgreSQL database:

1. **Create a PostgreSQL database on Render**
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Choose your plan and region

2. **Get the connection string**
   - Copy the "External Database URL"
   - Set it as `DATABASE_URL` environment variable

3. **Run migrations**
   ```bash
   npm run db:push
   ```

## API Endpoints

- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create a new conversation
- `GET /api/conversations/:id/messages` - Get messages for a conversation
- `POST /api/conversations/:id/messages` - Send a message and get AI response

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY is not set"**
   - Make sure you've set the environment variable correctly
   - Check that your API key is valid

2. **Build fails on Render**
   - Ensure all dependencies are in `package.json`
   - Check that the build command is correct

3. **App doesn't start**
   - Verify the start command is `npm start`
   - Check the logs in Render dashboard

### Getting Help

- Check the Render logs in your service dashboard
- Verify all environment variables are set correctly
- Ensure your API key has the necessary permissions

## License

MIT License - feel free to use this project for your own applications! 