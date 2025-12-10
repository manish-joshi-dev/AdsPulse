import { FileText, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

export const UploadDropzone = ({ onUpload, isUploading }) => {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"]
    },
    multiple: false,
    noClick: true,
    disabled: isUploading,
    onDrop(acceptedFiles) {
      const [file] = acceptedFiles;
      if (file) {
        onUpload(file);
      }
    }
  });

  return (
    <section
      {...getRootProps()}
      className={clsx(
        "panel flex min-h-64 flex-col justify-between gap-6 p-6 transition",
        isDragActive && "border-signal bg-signal/5",
        isUploading && "pointer-events-none opacity-70"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase text-signal">New diagnostic</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Campaign health snapshot</h1>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-signal">
          <UploadCloud className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      <div className="rounded-lg border border-dashed border-zinc-300 bg-cloud p-6 text-center">
        <FileText className="mx-auto h-8 w-8 text-zinc-500" aria-hidden="true" />
        <p className="mt-3 text-base font-medium text-ink">
          {isDragActive ? "Drop CSV" : "Google Ads CSV"}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={open}
            disabled={isUploading}
            className="focus-ring inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed"
          >
            {isUploading ? "Analyzing" : "Choose file"}
          </button>
          <a
            href="/sample-google-ads.csv"
            className="focus-ring inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Sample CSV
          </a>
        </div>
      </div>
    </section>
  );
};

