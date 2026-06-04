import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Camera,
  CheckCircle2,
  FileImage,
  FlaskConical,
  ImagePlus,
  Info,
  Leaf,
  ListChecks,
  ShieldCheck,
  Stethoscope,
  UploadCloud,
  X,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { uploadImage } from "../api/imageApi";
import BackButton from "../components/common/BackButton";

const severityTone = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  unknown: "border-slate-200 bg-slate-50 text-slate-600",
};

const confidenceTone = {
  High: "bg-emerald-600 text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-slate-600 text-white",
};

const getPrediction = (result) => result?.prediction || {};

const ResultSection = ({ icon, title, children }) => {
  const SectionIcon = icon;

  return (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        <SectionIcon size={20} />
      </span>
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
    </div>
    <div className="mt-4">{children}</div>
  </div>
  );
};

const BulletList = ({ items = [] }) => (
  <ul className="space-y-3">
    {items.map((item, index) => (
      <li key={`${item}-${index}`} className="flex gap-3 text-sm font-medium leading-6 text-slate-600">
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={17} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const ImageUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropName, setCropName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const prediction = useMemo(() => getPrediction(result), [result]);
  const report = result?.report || {};
  const severity = prediction.severity || "unknown";
  const confidence = prediction.confidence || "Low";
  const confidenceScore = Number(prediction.confidenceScore || 0);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setResult(null);
    setError("");

    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please upload a crop image before analyzing.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("cropName", cropName.trim());
    formData.append("symptoms", symptoms.trim());

    try {
      setLoading(true);
      setError("");
      const response = await uploadImage(formData);
      setResult(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "Image analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-8">
      <BackButton />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-8">
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Plant health</p>
        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">Image Disease Detection</h1>
            <p className="mt-3 max-w-2xl font-medium leading-7 text-slate-600">
              Upload a clear crop photo and add visible symptoms for a structured diagnosis report with next steps.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
            <Stethoscope size={17} />
            Plant diagnosis report
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <UploadCloud size={23} />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-950">Upload details</h2>
              <p className="text-sm font-medium text-slate-500">Photo, crop name, and visible signs</p>
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center transition hover:border-emerald-300 hover:bg-emerald-50">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
              <ImagePlus size={32} />
            </span>
            <span className="mt-4 text-lg font-black text-slate-900">
              {selectedFile ? selectedFile.name : "Choose crop photo"}
            </span>
            <span className="mt-2 text-sm font-medium text-slate-500">PNG, JPG, JPEG, or camera image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
          </label>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-sm font-black text-slate-700">Crop name</span>
              <input
                type="text"
                value={cropName}
                onChange={(event) => setCropName(event.target.value)}
                placeholder="Example: Tomato, potato, wheat"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-slate-700">Visible symptoms</span>
              <textarea
                value={symptoms}
                onChange={(event) => setSymptoms(event.target.value)}
                rows={4}
                placeholder="Example: black sunken spots on tomato fruit, yellow leaves, white powder, brown lesions"
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold leading-6 text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={handleUpload} disabled={loading || !selectedFile}>
              <span className="inline-flex items-center justify-center gap-2">
                <FlaskConical size={18} />
                {loading ? "Analyzing..." : "Analyze image"}
              </span>
            </Button>
            {selectedFile && (
              <button
                type="button"
                onClick={clearImage}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-600 transition hover:bg-slate-50"
              >
                <X size={18} />
                Clear
              </button>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-700">
              <Camera size={23} />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-950">Image preview</h2>
              <p className="text-sm font-medium text-slate-500">Use a close, bright photo of the affected part</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {preview ? (
              <img src={preview} alt="Selected crop preview" className="h-[28rem] w-full object-cover" />
            ) : (
              <div className="grid h-[28rem] place-items-center p-8 text-center">
                <div>
                  <FileImage className="mx-auto text-slate-300" size={58} />
                  <p className="mt-4 text-lg font-black text-slate-500">Preview will appear here</p>
                  <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-400">
                    For best results, capture the diseased leaf, fruit, or stem directly in good light.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>

      {result && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Leaf size={30} />
              </span>
              <div>
                <p className="font-extrabold uppercase tracking-[0.18em] text-emerald-700">Detection result</p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950">{prediction.disease}</h2>
                <p className="mt-2 max-w-3xl font-medium leading-7 text-slate-600">{prediction.advice}</p>
              </div>
            </div>

            <div className="grid min-w-full gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
              <div className={`rounded-xl border px-4 py-3 ${severityTone[severity] || severityTone.unknown}`}>
                <p className="text-xs font-black uppercase tracking-[0.14em] opacity-75">Severity</p>
                <p className="mt-1 text-xl font-black capitalize">{severity}</p>
              </div>
              <div className={`rounded-xl px-4 py-3 ${confidenceTone[confidence] || confidenceTone.Low}`}>
                <p className="text-xs font-black uppercase tracking-[0.14em] opacity-80">Confidence</p>
                <p className="mt-1 text-xl font-black">{confidence}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Score</p>
                <p className="mt-1 text-xl font-black">{confidenceScore}%</p>
              </div>
            </div>
          </div>

          {prediction.needsReview && (
            <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
              <Info className="mt-0.5 shrink-0" size={18} />
              This is a preliminary diagnosis from the uploaded details. Add clear symptoms or consult a local agriculture expert before pesticide or fungicide use.
            </div>
          )}

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <ResultSection icon={BadgeCheck} title="Matched symptoms">
              <BulletList items={prediction.symptoms || []} />
            </ResultSection>
            <ResultSection icon={AlertTriangle} title="Likely causes">
              <BulletList items={prediction.likelyCauses || []} />
            </ResultSection>
            <ResultSection icon={ListChecks} title="Action plan">
              <BulletList items={prediction.actionPlan || []} />
            </ResultSection>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <ResultSection icon={ShieldCheck} title="Prevention">
              <BulletList items={prediction.prevention || []} />
            </ResultSection>

            <ResultSection icon={Info} title="Report details">
              <div className="grid gap-3 text-sm font-semibold text-slate-600">
                <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
                  <span>Crop</span>
                  <span className="text-right font-black text-slate-900">{prediction.crop || cropName || "Not specified"}</span>
                </div>
                <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
                  <span>Evidence</span>
                  <span className="text-right font-black text-slate-900">{prediction.evidence || "Image and form details"}</span>
                </div>
                <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
                  <span>Report ID</span>
                  <span className="text-right font-black text-slate-900">{report.id || "Generated"}</span>
                </div>
              </div>
            </ResultSection>
          </div>
        </section>
      )}
    </div>
  );
};

export default ImageUploadPage;
