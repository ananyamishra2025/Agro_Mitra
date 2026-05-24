import { useState } from "react";
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question },
    ]);

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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-900 via-green-800 to-lime-700 p-10 text-white shadow-2xl">

        {/* Glow Effect */}
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <p className="font-extrabold uppercase tracking-[0.3em] text-lime-100">
          Conversational Help
        </p>

        <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-tight">
          AI Chatbot
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
          Ask questions about crops, fertilizer, diseases,
          irrigation, weather, or gardening in natural language.
        </p>

      </section>

      {/* CHAT CONTAINER */}
      <Card className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-0 shadow-xl">

        {/* TOP BAR */}
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-700 to-lime-600 p-6 text-white">

          <div className="flex items-center gap-4">

            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-3xl backdrop-blur-md">
              🤖
            </div>

            <div>
              <h2 className="text-4xl font-black text-slate-900">
                Agro Assistant
              </h2>

              <p className="mt-1 text-emerald-50">
                AI-powered farming guidance system
              </p>
            </div>

          </div>

        </div>

        {/* CHAT AREA */}
        <div className="h-[32rem] overflow-y-auto bg-gradient-to-b from-emerald-50/40 to-white p-6">

          <div className="space-y-5">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-4 leading-7 shadow-md transition-all ${
                    msg.sender === "user"
                      ? "rounded-br-md bg-gradient-to-r from-emerald-600 to-green-700 text-white"
                      : "rounded-bl-md border border-emerald-100 bg-white text-slate-700"
                  }`}
                >
                  {msg.text}
                </div>

              </div>
            ))}

            {loading && (
              <div className="w-fit rounded-3xl border border-emerald-100 bg-white px-5 py-4 font-semibold text-slate-500 shadow-sm">
                Typing...
              </div>
            )}

          </div>

        </div>

        {/* INPUT SECTION */}
        <div className="border-t border-emerald-100 bg-white p-5">

          <div className="flex flex-col gap-4 sm:flex-row">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
              placeholder="Ask about crops, fertilizer, pests, irrigation..."
              className="flex-1 rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />

            <Button
              onClick={handleSend}
              disabled={loading}
              className="rounded-2xl px-8 py-4"
            >
              Send
            </Button>

          </div>

        </div>

      </Card>

    </div>
  );
};

export default ChatbotPage;
