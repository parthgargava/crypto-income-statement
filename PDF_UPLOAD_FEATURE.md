# PDF Upload Feature

## Overview
The Calico Crypto Statement app now supports PDF upload functionality that allows users to upload crypto exchange statements and automatically analyze their transactions.

## Features

### File Upload Interface
- **Drag & Drop**: Users can drag and drop PDF files directly onto the upload area
- **Browse Files**: Traditional file browser button for selecting PDF files
- **File Validation**: 
  - Only PDF files are accepted
  - Maximum file size: 10MB
  - Real-time error feedback for invalid files

### Upload Process
1. **File Selection**: User selects or drops a PDF file
2. **Validation**: File type and size are validated
3. **Progress Animation**: Real-time progress bar shows upload and processing status
4. **PDF Parsing**: Text is extracted from the PDF using pdf-parse library
5. **AI Categorization**: Transactions are automatically categorized using AI
6. **Success Feedback**: Green success message with completion confirmation
7. **Auto-Navigation**: Automatically redirects to results page after processing

### Technical Implementation

#### Components
- `FileUpload`: Main upload component with drag & drop functionality
- `Progress`: Progress bar component for upload status
- `InputView`: Updated to include PDF upload tab

#### PDF Parsing
- API route (`/api/parse-pdf`) handles PDF processing
- Currently uses mock data for demonstration (pdf-parse library has initialization issues)
- In production, would use a more reliable PDF parsing library
- Supports common crypto exchange statement formats
- Extracts transaction data including:
  - Date and time
  - Transaction type (buy, sell, deposit, withdrawal, reward)
  - Amount and currency
  - Fees
  - Exchange information

#### Data Flow
1. PDF file → FormData
2. FormData → Server API (`/api/parse-pdf`)
3. Server → Text extraction via pdf-parse
4. Text → Transaction parsing
5. Transactions → AI categorization
6. Categorized data → Results display

### Error Handling
- File type validation
- File size limits
- PDF parsing errors
- Network/processing errors
- User-friendly error messages

### Styling
- Consistent with Calico design system
- Purple gradient theme (#9D4EDD)
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Loading states and progress indicators

## Usage

### For Users
1. Click on "Upload Statement" tab
2. Either drag & drop a PDF file or click "Browse Files"
3. Wait for the progress bar to complete
4. View automatically categorized results

### For Developers
The PDF upload functionality is integrated into the existing dashboard flow:

```typescript
// Handle PDF upload
const handlePDFUpload = async (file: File) => {
  // Process PDF and categorize transactions
  const pdfData = await parsePDFFile(file);
  const transactions = convertPDFTransactionsToAIFormat(pdfData.transactions);
  const result = await getCategorizedTransactions({ transactions });
  // Display results
};
```

## Dependencies
- Existing UI components (Progress, Button, etc.)
- Note: pdf-parse library has initialization issues in this environment

## Future Enhancements
- Support for CSV files
- Better PDF format detection
- More exchange-specific parsers
- Batch file processing
- OCR for image-based PDFs
