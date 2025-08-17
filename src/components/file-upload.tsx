"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onUploadComplete: () => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function FileUpload({ onFileUpload, onUploadComplete, isUploading, uploadProgress }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    
    // Check file type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
      setError("Please select a PDF file");
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    
    setSelectedFile(file);
    onFileUpload(file);
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {error && (
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}
      
      {!selectedFile ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center space-y-6 rounded-xl border-2 border-dashed border-border p-12 text-center transition-all duration-200",
            isDragOver 
              ? "border-primary bg-primary/5 scale-105" 
              : "hover:border-primary/50 hover:bg-muted/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={cn(
            "calico-gradient p-4 rounded-full transition-transform duration-200",
            isDragOver && "scale-110"
          )}>
            <Upload className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="font-semibold text-lg text-foreground">
              {isDragOver ? "Drop your PDF file here" : "Drag & drop your PDF file here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">or</p>
          </div>
          <Button 
            className="calico-button" 
            onClick={handleBrowseClick}
            disabled={isUploading}
          >
            Browse Files
          </Button>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported format: PDF files only</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Processing PDF...</span>
                </span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Extracting transaction data and categorizing with AI...
              </p>
            </div>
          )}

          {uploadProgress === 100 && (
            <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-green-50 border border-green-200 animate-in fade-in duration-500">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                PDF processed successfully! Redirecting to results...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
