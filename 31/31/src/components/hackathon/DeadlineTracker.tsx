import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

interface DeadlineTrackerProps {
  registrationDeadline: Date;
  hackathonStartDate: Date;
  hackathonEndDate: Date;
}

const DeadlineTracker = ({ registrationDeadline, hackathonStartDate, hackathonEndDate }: DeadlineTrackerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const days = differenceInDays(registrationDeadline, now);
      const hours = differenceInHours(registrationDeadline, now) % 24;
      const minutes = differenceInMinutes(registrationDeadline, now) % 60;

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [registrationDeadline]);

  const getProgressPercentage = () => {
    const total = differenceInDays(hackathonEndDate, hackathonStartDate);
    const elapsed = differenceInDays(new Date(), hackathonStartDate);
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const isRegistrationOpen = new Date() < registrationDeadline;
  const isHackathonActive = new Date() >= hackathonStartDate && new Date() <= hackathonEndDate;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Deadline Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Registration Deadline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Registration Deadline</span>
            <span className="text-sm text-gray-500">
              {format(registrationDeadline, 'PPP')}
            </span>
          </div>
          {isRegistrationOpen ? (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-amber-600">
                {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes left
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-600">Registration closed</span>
            </div>
          )}
        </div>

        {/* Hackathon Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Hackathon Timeline</span>
            <span className="text-sm text-gray-500">
              {format(hackathonStartDate, 'MMM d')} - {format(hackathonEndDate, 'MMM d, yyyy')}
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Start</span>
            <span>End</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${
            isHackathonActive ? 'bg-green-500' : 
            isRegistrationOpen ? 'bg-amber-500' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {isHackathonActive ? 'Hackathon in Progress' :
             isRegistrationOpen ? 'Registration Open' : 'Registration Closed'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeadlineTracker; 