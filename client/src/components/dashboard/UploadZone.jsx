import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProgressTracker } from './ProgressTracker.jsx';

/**
 * UploadZone - Drag and drop zone for CSV file uploads
 */
export const UploadZone = ({ onUploadStart, onProgress, onUploadComplete, isUploading, progress = 0, currentStep = '' }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  // Handle file drop/select
  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setFileName(file.name);
    toast.success('Analyzing your campaigns...');
    onUploadStart(file);
  }, [onUploadStart]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { 'text/csv': ['.csv'] },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled: isUploading
  });

  if (isUploading) {
    return <ProgressTracker progress={progress} currentStep={currentStep} status="processing" />;
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative p-12 rounded-2xl border-2 border-dashed transition-all transform cursor-pointer ${
          isDragActive
            ? 'scale-[1.02] border-[#4F8EF7]'
            : 'border-[#1E2D45] hover:border-[#4F8EF7]/50'
        }`}
        style={{
          background: isDragActive
            ? 'rgba(79, 142, 247, 0.05)'
            : 'var(--color-bg-secondary)',
          boxShadow: isDragActive ? '0 0 0 8px rgba(79, 142, 247, 0.1)' : 'none'
        }}
      >
        <input {...getInputProps()} />

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all transform ${
              isDragActive ? 'scale-110' : ''
            }`}
            style={{
              background: isDragActive
                ? 'rgba(79, 142, 247, 0.2)'
                : 'rgba(79, 142, 247, 0.1)'
            }}
          >
            <Upload
              className={`w-8 h-8 transition-all ${isDragActive ? 'animate-bounce' : ''}`}
              style={{
                color: isDragActive ? '#4F8EF7' : '#60A5FA'
              }}
            />
          </div>

          <div>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Drop your Google Ads CSV here
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mt-1">
              or click to browse your files
            </p>
          </div>

          {/* Requirements */}
          <div
            className="mt-6 px-4 py-3 rounded-lg flex gap-2"
            style={{
              background: 'rgba(79, 142, 247, 0.05)',
              border: '1px solid rgba(79, 142, 247, 0.2)'
            }}
          >
            <FileText className="w-4 h-4 text-[#4F8EF7] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#94A3B8]">
              <span className="font-semibold text-[#F1F5F9]">Requirements:</span> CSV format, max 50MB, Google Ads export
            </p>
          </div>
        </div>
      </div>

      {/* Alternative upload button */}
      <div className="mt-6 flex items-center gap-4">
        <div
          className="flex-1 h-px"
          style={{ background: 'var(--color-border)' }}
        />
        <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium">
          or
        </p>
        <div
          className="flex-1 h-px"
          style={{ background: 'var(--color-border)' }}
        />
      </div>

      <label
        htmlFor="file-input-alt"
        className="mt-6 block w-full py-3 px-4 rounded-lg font-semibold text-center border transition-all cursor-pointer hover:opacity-80"
        style={{
          background: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-primary)'
        }}
      >
        Browse Files
      </label>
      <input
        id="file-input-alt"
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleDrop([file]);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default UploadZone;
