<p align="center">
  <img src="https://raw.githubusercontent.com/ShreyJaiswal1/cortexa-datainsight-ai/refs/heads/main/Frontend/public/cortexabanner.svg" alt="Cortexa Banner" width="100%" />
</p>

# Cortexa DataInsight AI 🧠

**A Smart AI-Powered Data Analysis Tool**

Cortexa DataInsight AI is a modern full-stack web application that combines the power of artificial intelligence with intuitive data analysis capabilities. Built with cutting-edge technologies, it allows users to upload datasets, interact with data through natural language queries, and analyze images using advanced AI models.

## 🚀 Features

### Data Analysis
- **Multi-format Support**: Upload and analyze CSV, Excel (.xls/.xlsx), JSON, and Parquet files
- **Interactive Chat Interface**: Ask questions about your data in plain English
- **Real-time Analysis**: Get instant insights and statistical summaries
- **AI-Powered Responses**: Leverage Groq's powerful language models for intelligent data interpretation

### Image Analysis
- **Image Recognition**: Upload images for AI-powered object detection and description
- **Multi-format Support**: Compatible with various image formats (PNG, JPEG, etc.)
- **Gemini Vision Integration**: Utilizes Google's Gemini 1.5 Flash model for accurate image analysis

### User Experience
- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Real-time Chat**: Seamless conversation interface for data queries
- **Secure Authentication**: Integrated Clerk authentication system
- **File Management**: Drag-and-drop file uploads with progress indicators

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Pandas**: Data manipulation and analysis library
- **Groq AI**: Advanced language model integration (`openai/gpt-oss-120b`)
- **Google Gemini**: Vision AI for image analysis (`gemini-1.5-flash`)
- **Python Libraries**:
  - `python-dotenv` for environment management
  - `Pillow (PIL)` for image processing
  - `python-multipart` for file handling

### Frontend
- **Next.js 15.5.0**: React framework with latest features
- **React 19.1.0**: Latest React with concurrent features
- **Tailwind CSS**: Modern utility-first CSS framework
- **Clerk Authentication**: Complete user management solution
- **UI Components**:
  - Radix UI primitives for accessible components
  - Lucide React for modern icons
  - React Markdown for formatted text display
  - Custom themed components with dark/light mode

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization
- **Turbopack**: Ultra-fast bundler for development
- **TypeScript Support**: Type-safe development environment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- Groq API key
- Google AI API key
- Clerk authentication keys

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install fastapi uvicorn pandas groq google-generativeai python-dotenv pillow python-multipart
   ```

3. **Configure environment variables**
   ```bash
   cp example.env .env
   ```
   
   Edit `.env` file:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp example.env .env.local
   ```
   
   Add your Clerk keys to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000
- API Documentation: http://127.0.0.1:8000/docs

## 🔧 API Endpoints

### Data Analysis
- `POST /api/data/upload-data/` - Upload and analyze data files
- `POST /api/data/chat/` - Chat with your data using natural language

### Image Analysis
- `POST /api/image/detect-object/` - Analyze and describe uploaded images

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account or log in using Clerk authentication
2. **Upload Data**: Drag and drop your data file (CSV, Excel, JSON, Parquet)
3. **Analyze**: Ask questions about your data in natural language
4. **Image Analysis**: Upload images for AI-powered analysis and description
5. **Interactive Chat**: Continue the conversation to dive deeper into insights

## 🌟 Key Features Highlight

- **Multi-modal AI**: Combines text and vision AI capabilities
- **Real-time Processing**: Instant responses to data queries
- **Secure & Scalable**: Built with production-ready frameworks
- **Modern Architecture**: Separation of concerns with clean API design
- **Responsive Design**: Works seamlessly across all devices
- **Theme Support**: Beautiful dark and light mode interfaces

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please open an issue in this repository.

---

**Built with ❤️ by [Shrey Jaiswal](https://github.com/ShreyJaiswal1)**