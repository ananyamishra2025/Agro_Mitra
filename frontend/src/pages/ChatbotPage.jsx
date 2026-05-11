import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { askChatbot } from "../api/chatbotApi";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Namaste! Ask me about crops, soil, irrigation, pests, or gardening." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input;
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");

    try {
      setLoading(true);
      const response = await askChatbot({ question });
      setMessages((prev) => [...prev, { sender: "bot", text: response.data?.answer || "No response" }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I could not get a response right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-extrabold uppercase tracking-[0.25em] text-emerald-700">Conversational help</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">AI Chatbot</h1>
      </section>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-700 to-lime-600 p-6 text-white">
          <h2 className="text-2xl font-black">Agro assistant</h2>
          <p className="mt-1 text-emerald-50">Ask in simple language and get quick farming guidance.</p>
        </div>
        <div className="h-[28rem] overflow-y-auto bg-emerald-50/40 p-5">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-3xl px-4 py-3 leading-7 shadow-sm ${
                  msg.sender === "user"
                    ? "rounded-br-md bg-emerald-600 text-white"
                    : "rounded-bl-md bg-white text-slate-700"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="w-fit rounded-3xl bg-white px-4 py-3 font-semibold text-slate-500">Typing...</div>}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-emerald-100 bg-white p-4 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about crops, soil, pests..."
            className="flex-1 rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
          <Button onClick={handleSend} disabled={loading}>Send</Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotPage;
