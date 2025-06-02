import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import ProfileForm from '../components/forms/ProfileForm';
import useAuthStore from '../store/authStore';
import Alert from '../components/ui/Alert';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [success, setSuccess] = React.useState(false);
  
  const handleSuccess = () => {
    setSuccess(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
      
      {success && (
        <div className="mb-6">
          <Alert variant="success" onClose={() => setSuccess(false)}>
            Profile updated successfully!
          </Alert>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h2>
          <p className="text-sm text-gray-500">
            Update your profile information to help others find you for team collaboration.
          </p>
        </CardHeader>
        
        <CardContent>
          <ProfileForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;