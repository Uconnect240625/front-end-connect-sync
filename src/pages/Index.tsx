
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to U Connect</h1>
        <p className="text-xl text-muted-foreground mb-8">Your Campus Smart Companion</p>
        <Link 
          to="/uconnect"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Enter U Connect
        </Link>
      </div>
    </div>
  );
};

export default Index;
