# PDF Viewer with Text-to-Speech (TTS)

## Overview
This is a **PDF Viewer** application that allows users to upload and view PDF files. It includes **text-to-speech (TTS)** integration, enabling users to listen to the content of the PDF. The app supports **page navigation**, **zoom controls**, and **dynamic audio generation** for each page.

---

## Features
- **PDF Upload**: Upload PDFs via drag-and-drop or file selection.
- **Text-to-Speech**: Generate and play audio for each page.
- **Page Navigation**: Navigate between pages with buttons or input.
- **Zoom Controls**: Zoom in, zoom out, and reset zoom.
- **Responsive Design**: Works seamlessly on desktop and mobile.

---

## Technologies Used
- **Frontend**:
  - React.js
  - Tailwind CSS (for styling)
  - `react-pdf` (for PDF rendering)
  - `pdfjs-dist` (for text extraction)
- **APIs**:
  - Play.ai (for TTS generation)
- **Environment Management**:
  - `.env` file for storing API keys.

---

## How to Run the App

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/playaitest.git
cd playaitest
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
NEXT_PUBLIC_API_AUTHORIZATION=your_api_authorization_key
NEXT_PUBLIC_API_USER_ID=your_api_user_id
```

### 4. Run the Application
```bash
npm run dev
# or
yarn dev
```

### 5. Open the App
Visit `http://localhost:3000` in your browser.

---

## Design Decisions
1. **Component-Based Architecture**:
   - The app is divided into reusable components (`PDFUploader`, `PDFViewer`, `PDFControls`, etc.) for better maintainability.

2. **Dynamic Audio Generation**:
   - Audio is generated on-demand for each page and cached to avoid redundant API calls.

3. **Responsive UI**:
   - Tailwind CSS is used for responsive and consistent styling.

4. **Environment Variables**:
   - API keys are stored in `.env` for security and flexibility.

5. **User Experience**:
   - Drag-and-drop file upload, preloading adjacent pages, and dynamic audio controls enhance usability.

---

## Folder Structure
```
playaitest/
├── components/       # Reusable components
├── pages/            # Main page (Home component)
├── public/           # Static assets
├── .env              # Environment variables
├── .gitignore        # Files to ignore in Git
├── package.json      # Project dependencies
├── README.md         # Project documentation
└── tsconfig.json     # TypeScript configuration
```

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---