import { useState } from "react";
import { Bot, CloudSun, FlaskConical, Leaf, Send, Sprout } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { askChatbot } from "../api/chatbotApi";
import BackButton from "../components/common/BackButton";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! Ask me about crops, soil, irrigation, pests, or gardening.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const suggestedQuestions = [
    { icon: <Sprout size={22} />, title: "What crop should I grow?", text: "Season and soil-based crop advice" },
    { icon: <FlaskConical size={22} />, title: "Fertilizer recommendation", text: "NPK and organic input guidance" },
    { icon: <Leaf size={22} />, title: "Disease symptoms", text: "Explain visible crop health issues" },
    { icon: <CloudSun size={22} />, title: "Weather advice", text: "Plan irrigation and field work" },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");

    try {
      setLoading(true);
      const response = await askChatbot({ question });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data?.answer || "No response",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I could not get a response right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.3em] text-emerald-700">
          Conversational Help
        </p>

        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
          AI Chatbot
        </h1>

        <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-600">
          Ask questions about crops, fertilizer, diseases, irrigation, weather,
          or gardening in natural language.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {suggestedQuestions.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setInput(item.title)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:scale-110">
              {item.icon}
            </span>
            <h3 className="mt-4 font-black text-slate-950">{item.title}</h3>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
          </button>
        ))}
      </section>

      <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-xl">
        <div className="border-b border-slate-100 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Bot size={30} />
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-950">Agro Assistant</h2>
              <p className="mt-1 font-medium text-slate-500">
                AI-powered farming guidance system
              </p>
            </div>
          </div>
        </div>

        <div className="grid bg-slate-50/70 lg:grid-cols-[1fr_280px]">
          <div className="h-[32rem] overflow-y-auto p-6">
            <div className="space-y-5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-4 leading-7 shadow-md transition-all ${
                      msg.sender === "user"
                        ? "rounded-br-md bg-green-700 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="w-fit rounded-3xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-500 shadow-sm">
                  Typing...
                </div>
              )}
            </div>
          </div>

          <aside className="border-t border-slate-100 bg-white p-5 lg:border-l lg:border-t-0">
            <h3 className="font-black text-slate-950">Chat History</h3>
            <div className="mt-4 grid gap-3">
              {["Summer crop question", "Tomato pest control", "Soil fertility tips"].map((item) => (
                <button key={item} type="button" className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-left text-sm font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                  {item}
                </button>
              ))}
            </div>

            <h3 className="mt-6 font-black text-slate-950">Quick Actions</h3>
            <div className="mt-4 grid gap-3">
              {["Crop plan", "Fertilizer", "Weather", "Disease"].map((item) => (
                <button key={item} type="button" className="rounded-xl bg-emerald-50 px-4 py-3 text-left text-sm font-black text-emerald-800 transition hover:bg-emerald-100">
                  {item}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="border-t border-slate-100 bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about crops, fertilizer, pests, irrigation..."
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />

            <Button onClick={handleSend} disabled={loading} className="rounded-2xl px-8 py-4">
              <span className="inline-flex items-center gap-2">
                <Send size={18} />
                Send
              </span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotPage;
