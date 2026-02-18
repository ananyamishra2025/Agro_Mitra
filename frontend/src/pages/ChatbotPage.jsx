import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { askChatbot } from "../api/chatbotApi";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setLoading(true);

      const response = await askChatbot({ question: input });

      const botMessage = {
        sender: "bot",
        text: response.data?.answer || "No response",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error getting response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">AI Chatbot</h1>

      <Card>
        <div className="h-96 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-green-600 text-white ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
              Typing...
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crops, soil, pests..."
            className="flex-1 border p-2 rounded"
          />

          <Button onClick={handleSend}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotPage;
