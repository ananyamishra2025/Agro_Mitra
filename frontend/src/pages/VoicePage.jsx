import { useRef, useState } from "react";
import { Mic, MicOff, Play, Send, Square, Upload } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { askVoice, askVoiceText } from "../api/voiceApi";
import BackButton from "../components/common/BackButton";

const languageOptions = [
  { label: "Bengali", value: "bn-IN", speech: "bn-IN" },
  { label: "Hindi", value: "hi-IN", speech: "hi-IN" },
  { label: "English", value: "en-IN", speech: "en-IN" },
];

const getSpeechRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition;

const VoicePage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [language, setLanguage] = useState("bn-IN");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("");
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const chunksRef = useRef([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file || null);
    setAudioUrl(file ? URL.createObjectURL(file) : "");
    setTranscript("");
  };

  const startRecording = async () => {
    setResult(null);
    setStatus("");
    setTranscript("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const file = new File([blob], `voice-question-${Date.now()}.webm`, { type: blob.type });
        setAudioFile(file);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      const SpeechRecognition = getSpeechRecognition();
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          const text = Array.from(event.results)
            .map((item) => item[0].transcript)
            .join(" ");
          setTranscript(text.trim());
        };
        recognition.onerror = () => {
          setStatus("Browser transcript is unavailable. Recording audio instead.");
        };
        recognitionRef.current = recognition;
        recognition.start();
      } else {
        setStatus("Your browser does not support instant speech text. Audio recording still works.");
      }

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error(error);
      setStatus("Microphone permission is required to record voice.");
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const speakAnswer = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    if (!audioFile && !transcript) return;

    try {
      setLoading(true);
      setStatus("");
      const response = transcript
        ? await askVoiceText({ language, textQuestion: transcript })
        : await submitAudio();

      setResult(response.data);
      speakAnswer(response.data?.textAnswer);
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Voice processing failed");
    } finally {
      setLoading(false);
    }
  };

  const submitAudio = async () => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("language", language);
    return askVoice(formData);
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Accessible assistant</p>
        <h1 className="mt-4 text-5xl font-extrabold leading-tight text-slate-950 md:text-6xl">Voice Assistant</h1>
        <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          Speak in Bengali, Hindi, or English. Agro-Mitra will capture your question and answer instantly when browser speech recognition is available.
        </p>
      </section>

      <Card className="max-w-4xl p-7">
        <div className="grid gap-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Select Language</label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              disabled={recording}
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-lg font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              className={`flex min-h-32 flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center font-black transition ${
                recording
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              {recording ? <Square size={34} /> : <Mic size={34} />}
              <span className="mt-3">{recording ? "Stop Recording" : "Start Voice Recording"}</span>
              <span className="mt-1 text-sm font-semibold opacity-80">
                {recording ? "Listening now..." : "Tap and speak your question"}
              </span>
            </button>

            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center font-black text-slate-700 transition hover:bg-white">
              <Upload size={34} />
              <span className="mt-3">{audioFile ? audioFile.name : "Choose an audio file"}</span>
              <span className="mt-1 text-sm font-semibold text-slate-500">Optional upload fallback</span>
              <input type="file" accept="audio/*" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>

          {audioUrl && (
            <audio className="w-full" controls src={audioUrl} />
          )}

          <label>
            <span className="text-sm font-black text-slate-700">Recognized Question</span>
            <textarea
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Your spoken question will appear here. You can also type or edit it before submitting."
            />
          </label>

          {status && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-bold text-amber-800">
              {status}
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading || recording || (!audioFile && !transcript)}>
            <span className="inline-flex items-center justify-center gap-2">
              <Send size={19} />
              {loading ? "Processing..." : "Submit Voice"}
            </span>
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="p-7">
          <h2 className="text-2xl font-black text-slate-950">Response</h2>
          {result.textQuestion && (
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 font-semibold leading-7 text-slate-700">
              <span className="font-black text-emerald-800">You asked: </span>
              {result.textQuestion}
            </p>
          )}
          <p className="mt-4 text-lg font-medium leading-8 text-slate-700">{result.textAnswer}</p>
          <button
            type="button"
            onClick={() => speakAnswer(result.textAnswer)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 font-black text-emerald-800 shadow-sm transition hover:bg-emerald-50"
          >
            <Play size={18} />
            Play Answer
          </button>
          {result.audioAnswerUrl && <audio className="mt-5 w-full" controls src={result.audioAnswerUrl} />}
        </Card>
      )}
    </div>
  );
};

export default VoicePage;
