import { Headphones, Mail, MapPin, Phone } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const contactCards = [
  {
    icon: <Phone size={24} />,
    title: "Phone support",
    text: "+91 98765 43210",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: <Mail size={24} />,
    title: "Email enquiry",
    text: "support@agromitra.in",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    icon: <MapPin size={24} />,
    title: "Location",
    text: "Agro-Mitra Service Centre, Kolkata, West Bengal, India",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    icon: <Headphones size={24} />,
    title: "Response time",
    text: "We usually respond within one working day.",
    tone: "bg-violet-50 text-violet-700",
  },
];

const ContactPage = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Support and enquiries</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Contact Agro-Mitra</h1>
        <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          Send your question about crop advisory, account access, disease
          reports, learning resources, or business partnerships. Our team will
          use your details to follow up and help you move forward.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-8">
          <h2 className="text-3xl font-black text-slate-950">Send an enquiry</h2>
          <p className="mt-3 max-w-2xl font-medium leading-7 text-slate-600">
            Share your contact information and the kind of support you need.
          </p>

          <form className="mt-7 grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border border-emerald-100 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Your name" />
            <input className="rounded-xl border border-emerald-100 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Email or phone" />
            <select className="rounded-xl border border-emerald-100 px-4 py-3 font-medium text-slate-600 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
              <option>General enquiry</option>
              <option>Crop advisory help</option>
              <option>Account support</option>
              <option>Business partnership</option>
            </select>
            <input className="rounded-xl border border-emerald-100 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Village / city" />
            <textarea className="min-h-36 rounded-xl border border-emerald-100 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 md:col-span-2" placeholder="How can we help?" />
            <Button className="md:w-fit">Send Enquiry</Button>
          </form>
        </Card>

        <div className="grid gap-4">
          {contactCards.map((item) => (
            <Card key={item.title} className="flex items-start gap-4 p-6">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                {item.icon}
              </span>
              <div>
                <h3 className="font-black text-slate-950">{item.title}</h3>
                <p className="mt-1 font-medium text-slate-600">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
