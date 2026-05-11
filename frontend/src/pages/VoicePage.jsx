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
    <div className="space-y-8">
      <section>
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Accessible assistant</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Voice Assistant</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">Upload an audio question and choose the language for processing.</p>
      </section>

      <Card className="max-w-3xl">
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Select Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="hi-IN">Hindi</option>
              <option value="en-IN">English</option>
            </select>
          </div>

        <label className="rounded-[1.5rem] border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center font-bold text-slate-700">
            🎤 {audioFile ? audioFile.name : "Choose an audio file"}
            <input type="file" accept="audio/*" onChange={handleFileChange} className="sr-only" />
          </label>

        <Button onClick={handleSubmit} disabled={loading || !audioFile}>
            {loading ? "Processing..." : "Submit Voice"}
          </Button>
        </div>
      </Card>

      {result && (
        <Card>
          <h2 className="text-2xl font-black text-slate-950">Response</h2>
          <p className="mt-4 leading-7 text-slate-600">{result?.text}</p>
          {result?.audioUrl && <audio className="mt-5 w-full" controls src={result.audioUrl} />}
        </Card>
      )}
    </div>
  );
};

export default VoicePage;
