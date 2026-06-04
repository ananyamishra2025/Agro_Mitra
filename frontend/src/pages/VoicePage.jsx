import { useEffect, useRef, useState } from "react";
import { Mic, Play, Send, Square, Upload, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

const getVoices = () =>
  new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });

const pickVoice = (voices, language) => {
  const normalizedLanguage = language.toLowerCase();
  const languagePrefix = normalizedLanguage.split("-")[0];

  return (
    voices.find((voice) => voice.lang?.toLowerCase() === normalizedLanguage) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(languagePrefix)) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ||
    null
  );
};

const splitSpeechIntoChunks = (text) => {
  const cleanText = text
    .replace(/\s*([।.!?])\s*/g, "$1\n")
    .replace(/[,;:]\s*/g, ", ")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks = [];

  cleanText.forEach((sentence) => {
    if (sentence.length <= 180) {
      chunks.push(sentence);
      return;
    }

    let current = "";
    sentence.split(/\s+/).forEach((word) => {
      if (`${current} ${word}`.trim().length > 160) {
        if (current) chunks.push(current);
        current = word;
      } else {
        current = `${current} ${word}`.trim();
      }
    });
    if (current) chunks.push(current);
  });

  return chunks;
};

const normalizeAnswer = (answer = "") =>
  String(answer)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const makeSpeechFriendlyAnswer = (answer = "") =>
  limitSpeechAnswer(
    normalizeAnswer(answer)
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*\|?[-:\s|]{4,}\|?\s*$/gm, "")
    .replace(/^\s*\|/gm, "")
    .replace(/\|\s*$/gm, "")
    .replace(/\s*\|\s*/g, ". ")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim(),
  );

const limitSpeechAnswer = (answer) => {
  if (answer.length <= 900) return answer;

  const sentences = answer
    .split(/(?<=[।.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length > 1) {
    return sentences.slice(0, 7).join(" ");
  }

  return `${answer.slice(0, 900).trim()}...`;
};

const markdownProps = (props) => {
  const cleanProps = { ...props };
  delete cleanProps.node;
  return cleanProps;
};

const AnswerMarkdown = ({ answer }) => (
  <div className="overflow-x-auto text-base leading-8 text-slate-700">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => <h3 {...markdownProps(props)} className="mb-3 text-2xl font-black text-slate-950" />,
        h2: (props) => <h3 {...markdownProps(props)} className="mb-3 text-xl font-black text-slate-950" />,
        h3: (props) => <h4 {...markdownProps(props)} className="mb-2 text-lg font-black text-slate-950" />,
        p: (props) => <p {...markdownProps(props)} className="mb-4 last:mb-0" />,
        strong: (props) => <strong {...markdownProps(props)} className="font-black text-slate-900" />,
        ul: (props) => <ul {...markdownProps(props)} className="mb-4 ml-5 list-disc space-y-2" />,
        ol: (props) => <ol {...markdownProps(props)} className="mb-4 ml-5 list-decimal space-y-2" />,
        li: (props) => <li {...markdownProps(props)} className="pl-1" />,
        table: (props) => (
          <table {...markdownProps(props)} className="mb-5 min-w-full border-collapse text-left text-sm" />
        ),
        th: (props) => (
          <th {...markdownProps(props)} className="border border-slate-200 bg-emerald-50 px-3 py-2 font-black text-slate-900" />
        ),
        td: (props) => <td {...markdownProps(props)} className="border border-slate-200 px-3 py-2 align-top" />,
      }}
    >
      {normalizeAnswer(answer)}
    </ReactMarkdown>
  </div>
);

const VoicePage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [language, setLanguage] = useState("bn-IN");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState("");
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const chunksRef = useRef([]);
  const speechRunRef = useRef(0);

  useEffect(() => {
    if (!window.speechSynthesis) return undefined;

    getVoices();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

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

  const speakAnswer = async (text) => {
    if (!text || !window.speechSynthesis) {
      setStatus("Voice playback is not supported in this browser.");
      return;
    }

    const speechText = makeSpeechFriendlyAnswer(text);
    const chunks = splitSpeechIntoChunks(speechText);
    if (!chunks.length) return;

    window.speechSynthesis.cancel();
    const runId = speechRunRef.current + 1;
    speechRunRef.current = runId;

    const voices = await getVoices();
    const matchingVoice = pickVoice(voices, language);
    const hasSelectedLanguageVoice = matchingVoice?.lang?.toLowerCase().startsWith(language.split("-")[0]);

    if (!hasSelectedLanguageVoice) {
      setStatus("Your browser does not have a clear voice for this language. Try Chrome/Edge, or select English for clearer playback.");
    }

    setSpeaking(true);

    const speakChunk = (index) => {
      if (speechRunRef.current !== runId) return;

      if (index >= chunks.length) {
        setSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = hasSelectedLanguageVoice ? matchingVoice.lang : language;
      utterance.rate = language === "en-IN" ? 0.9 : 0.78;
      utterance.pitch = 1;
      utterance.volume = 1;
      if (matchingVoice) utterance.voice = matchingVoice;
      utterance.onend = () => window.setTimeout(() => speakChunk(index + 1), 180);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  };

  const stopSpeaking = () => {
    speechRunRef.current += 1;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
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
      await speakAnswer(response.data?.speechAnswer || response.data?.textAnswer);
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-extrabold uppercase tracking-[0.18em] text-emerald-700">Assistant response</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Clear Farming Guidance</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <Volume2 size={17} />
              Voice ready
            </span>
          </div>
          {result.textQuestion && (
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 font-semibold leading-7 text-slate-700">
              <span className="font-black text-emerald-800">You asked: </span>
              {result.textQuestion}
            </p>
          )}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <AnswerMarkdown answer={result.textAnswer} />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => speakAnswer(result.speechAnswer || result.textAnswer)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 font-black text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              <Play size={18} />
              {speaking ? "Replay Answer" : "Play Clear Answer"}
            </button>
            {speaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <VolumeX size={18} />
                Stop
              </button>
            )}
          </div>
          {result.audioAnswerUrl && <audio className="mt-5 w-full" controls src={result.audioAnswerUrl} />}
        </Card>
      )}
    </div>
  );
};

export default VoicePage;
