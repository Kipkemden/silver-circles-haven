
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to landing page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-silver-50">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Redirecting...</h1>
        <p className="text-xl text-silver-600">Please wait while we redirect you to our homepage.</p>
      </div>
    </div>
  );
};

export default Index;
