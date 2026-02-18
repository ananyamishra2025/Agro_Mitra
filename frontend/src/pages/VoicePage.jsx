import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { askVoice } from "../api/voiceApi";

const VoicePage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [language, setLanguage] = useState("hi-IN");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("language", language);

    try {
      setLoading(true);

      const response = await askVoice(formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Voice processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Voice Assistant (Indian Languages)
      </h1>

      <Card>
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Select Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="hi-IN">Hindi</option>
            <option value="en-IN">English</option>
          </select>
        </div>

        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Submit Voice"}
        </Button>
      </Card>

      {result && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Response
          </h2>

          <p className="mb-4">{result?.text}</p>

          {result?.audioUrl && (
            <audio controls src={result.audioUrl} />
          )}
        </Card>
      )}
    </div>
  );
};

export default VoicePage;
