import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import useAuthStore from '../store/authStore';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // If user is already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleSuccess = () => {
    navigate('/profile', { replace: true });
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Create your account
            </h2>
          </CardHeader>
          
          <CardContent>
            <RegisterForm onSuccess={handleSuccess} />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;