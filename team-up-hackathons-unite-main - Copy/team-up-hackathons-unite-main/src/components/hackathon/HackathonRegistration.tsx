import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface HackathonRegistrationProps {
  hackathonId: string;
  registrationDeadline: Date;
  onRegister: (data: RegistrationData) => Promise<void>;
}

interface RegistrationData {
  teamName: string;
  teamSize: number;
  projectIdea: string;
  techStack: string[];
  teamPreferences: string[];
  theme: string;
}

const HackathonRegistration = ({ hackathonId, registrationDeadline, onRegister }: HackathonRegistrationProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    teamName: '',
    teamSize: 4,
    projectIdea: '',
    techStack: [],
    teamPreferences: [],
    theme: ''
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await onRegister(formData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Hackathon Registration</CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Enter your team name"
              />
            </div>
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Select
                value={formData.teamSize.toString()}
                onValueChange={(value) => setFormData({ ...formData, teamSize: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 members</SelectItem>
                  <SelectItem value="3">3 members</SelectItem>
                  <SelectItem value="4">4 members</SelectItem>
                  <SelectItem value="5">5 members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectIdea">Project Idea</Label>
              <Textarea
                id="projectIdea"
                value={formData.projectIdea}
                onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                placeholder="Describe your project idea"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                value={formData.techStack.join(', ')}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(',').map(tech => tech.trim()) })}
                placeholder="Enter technologies (comma-separated)"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamPreferences">Team Preferences</Label>
              <Textarea
                id="teamPreferences"
                value={formData.teamPreferences.join(', ')}
                onChange={(e) => setFormData({ ...formData, teamPreferences: e.target.value.split(',').map(pref => pref.trim()) })}
                placeholder="Enter team preferences (comma-separated)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={formData.theme}
                onValueChange={(value) => setFormData({ ...formData, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Development</SelectItem>
                  <SelectItem value="ai">AI/ML</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="iot">IoT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Registration Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Team Name:</span> {formData.teamName}</p>
                <p><span className="font-medium">Team Size:</span> {formData.teamSize} members</p>
                <p><span className="font-medium">Theme:</span> {formData.theme}</p>
                <p><span className="font-medium">Tech Stack:</span> {formData.techStack.join(', ')}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Registration deadline: {format(registrationDeadline, 'PPP')}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit Registration
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HackathonRegistration; 