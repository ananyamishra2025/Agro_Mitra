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

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Image-based Disease Detection
      </h1>

      <Card>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mb-4 w-64 rounded-lg"
          />
        )}

        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Upload Image"}
        </Button>
      </Card>

      {result && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Detection Result
          </h2>
          <p>{JSON.stringify(result)}</p>
        </Card>
      )}
    </div>
  );
};

export default ImageUploadPage;
