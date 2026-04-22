import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">

      {/* HERO SECTION */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
          Agro-Mitra
        </h1>

        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          A Smart Agriculture Assistance System integrating
          AI-powered advisory, voice interaction, crop recommendations,
          and educational resources for farmers, gardeners, and students.
        </p>

        <Button onClick={() => navigate("/dashboard")}>
          Explore Dashboard
        </Button>
      </section>


      {/* TARGET USERS */}
      <section>
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
          Who Can Use Agro-Mitra?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <h3 className="text-xl font-semibold mb-3">👨‍🌾 Farmers</h3>
            <p className="text-gray-700">
              Get crop recommendations, fertilizer advice,
              and action plans based on season and soil conditions.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-3">🌱 Gardeners</h3>
            <p className="text-gray-700">
              Access gardening tips and plant care suggestions
              for better yield and maintenance.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-3">🎓 Students</h3>
            <p className="text-gray-700">
              Learn agriculture concepts through structured
              educational resources and AI-powered Q&A.
            </p>
          </Card>
        </div>
      </section>


      {/* CORE FEATURES */}
      <section>
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
          Core Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            🌾 Crop Advisory & Fertilizer Calculator
          </Card>

          <Card>
            🤖 AI Chatbot (Rule-based + AI fallback)
          </Card>

          <Card>
            🎤 Voice Assistant (Indian Languages)
          </Card>

          <Card>
            🖼 Image-based Disease Detection
          </Card>

          <Card>
            📚 Learning Resources Module
          </Card>

          <Card>
            📜 User History Tracking
          </Card>
        </div>
      </section>


      {/* TECH STACK */}
      <section className="text-center py-12 bg-green-50 rounded-2xl">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Technology Stack
        </h2>

        <p className="text-gray-700">
          Node.js • Express.js • MongoDB • React (Vite) • Tailwind CSS • REST APIs
        </p>
      </section>


      {/* FINAL CTA */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-6">
          Ready to Explore Smart Agriculture?
        </h2>

        <Button onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </section>

    </div>
  );
};

export default Home;