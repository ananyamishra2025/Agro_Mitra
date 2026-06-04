import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const normalizeBotText = (text) =>
  String(text || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const markdownProps = (props) => {
  const cleanProps = { ...props };
  delete cleanProps.node;
  return cleanProps;
};

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] overflow-hidden rounded-3xl px-5 py-4 leading-7 shadow-md transition-all md:max-w-[80%] ${
          isUser
            ? "rounded-br-md bg-green-700 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose-chat overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: (props) => (
                  <a
                    {...markdownProps(props)}
                    className="font-bold text-emerald-700 underline decoration-emerald-200 underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
                h1: (props) => (
                  <h3 {...markdownProps(props)} className="mb-3 text-xl font-black text-slate-950" />
                ),
                h2: (props) => (
                  <h3 {...markdownProps(props)} className="mb-3 text-lg font-black text-slate-950" />
                ),
                h3: (props) => (
                  <h4 {...markdownProps(props)} className="mb-2 text-base font-black text-slate-950" />
                ),
                p: (props) => <p {...markdownProps(props)} className="mb-3 last:mb-0" />,
                strong: (props) => (
                  <strong {...markdownProps(props)} className="font-black text-slate-900" />
                ),
                ul: (props) => (
                  <ul {...markdownProps(props)} className="mb-3 ml-5 list-disc space-y-1 last:mb-0" />
                ),
                ol: (props) => (
                  <ol {...markdownProps(props)} className="mb-3 ml-5 list-decimal space-y-1 last:mb-0" />
                ),
                li: (props) => <li {...markdownProps(props)} className="pl-1" />,
                table: (props) => (
                  <table
                    {...markdownProps(props)}
                    className="mb-4 min-w-full border-collapse overflow-hidden rounded-xl text-left text-sm"
                  />
                ),
                thead: (props) => <thead {...markdownProps(props)} className="bg-emerald-50" />,
                th: (props) => (
                  <th {...markdownProps(props)} className="border border-slate-200 px-3 py-2 font-black text-slate-900" />
                ),
                td: (props) => (
                  <td {...markdownProps(props)} className="border border-slate-200 px-3 py-2 align-top" />
                ),
              }}
            >
              {normalizeBotText(text)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
