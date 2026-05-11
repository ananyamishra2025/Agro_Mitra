import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { uploadImage } from "../api/imageApi";

const ImageUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const response = await uploadImage(formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Plant health</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Image Disease Detection</h1>
      </section>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-10 text-center transition hover:bg-emerald-50">
            <span className="text-5xl">🖼️</span>
            <span className="mt-4 text-xl font-black text-slate-900">Upload crop photo</span>
            <span className="mt-2 text-sm text-slate-500">PNG, JPG, or camera image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
          </label>
          <Button className="mt-5 w-full" onClick={handleUpload} disabled={loading || !selectedFile}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </Button>
        </Card>

        <Card className="min-h-80">
          {preview ? (
            <img src={preview} alt="Selected crop preview" className="h-72 w-full rounded-[1.5rem] object-cover" />
          ) : (
            <div className="grid h-72 place-items-center rounded-[1.5rem] bg-slate-100 text-center text-slate-500">
              Preview will appear here
            </div>
          )}
        </Card>
      </div>

      {result && (
        <Card>
          <h2 className="text-2xl font-black text-slate-950">Detection Result</h2>
          <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-emerald-100">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default ImageUploadPage;
