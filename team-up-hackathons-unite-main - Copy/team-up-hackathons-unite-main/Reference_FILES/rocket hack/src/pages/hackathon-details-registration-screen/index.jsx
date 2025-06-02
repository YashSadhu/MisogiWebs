import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EventInfoCard from './components/EventInfoCard';
import CollapsibleSection from './components/CollapsibleSection';
import RegistrationModal from './components/RegistrationModal';

import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const HackathonDetailsRegistrationScreen = () => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  // Mock hackathon data
  const hackathonData = {
    id: 1,
    title: "AI Innovation Challenge 2025",
    organizer: "TechCorp Solutions",
    organizerLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    startDate: "2025-06-15",
    endDate: "2025-06-17",
    registrationDeadline: "2025-06-10",
    location: "San Francisco, CA",
    mode: "Hybrid",
    totalPrize: "$50,000",
    prizes: [
      { position: "1st Place", amount: "$25,000", description: "Winner takes all" },
      { position: "2nd Place", amount: "$15,000", description: "Runner-up prize" },
      { position: "3rd Place", amount: "$10,000", description: "Third place prize" }
    ],
    tags: ["AI/ML", "Innovation", "Startup"],
    participants: 450,
    maxParticipants: 500,
    difficulty: "Intermediate",
    teamSize: "2-4 members",
    description: `Join us for the most exciting AI Innovation Challenge of 2024! This hackathon brings together brilliant minds from around the world to solve real-world problems using artificial intelligence and machine learning.

Whether you're a seasoned developer, a data scientist, or an AI enthusiast, this event offers the perfect platform to showcase your skills, learn from industry experts, and network with like-minded innovators.

Our challenge focuses on creating AI solutions that can make a positive impact on society. From healthcare and education to environmental sustainability and social justice, we encourage participants to think big and build solutions that matter.`,
    rules: `1. Teams must consist of 2-4 members maximum
2. All code must be written during the hackathon period
3. Use of pre-existing libraries and frameworks is allowed
4. Projects must be submitted by the deadline
5. All submissions must include a working demo
6. Intellectual property belongs to the team
7. Participants must follow the code of conduct
8. No plagiarism or copying of existing solutions
9. Teams must present their projects to judges
10. Decision of judges is final`,
    judgingCriteria: `Projects will be evaluated based on the following criteria:

**Innovation & Creativity (25%)**
- Originality of the idea and approach
- Creative use of AI/ML technologies
- Novel solutions to existing problems

**Technical Implementation (25%)**
- Code quality and architecture
- Proper use of AI/ML algorithms
- Technical complexity and execution

**Impact & Usefulness (25%)**
- Real-world applicability
- Potential for positive social impact
- Market viability and scalability

**Presentation & Demo (25%)**
- Clarity of presentation
- Quality of demo and user experience
- Team's ability to communicate the solution`,
    schedule: [
      {
        day: "Day 1 - June 15, 2025",
        events: [
          { time: "09:00 AM", activity: "Registration & Check-in" },
          { time: "10:00 AM", activity: "Opening Ceremony" },
          { time: "11:00 AM", activity: "Team Formation & Networking" },
          { time: "12:00 PM", activity: "Lunch & Sponsor Booths" },
          { time: "01:00 PM", activity: "Hacking Begins!" },
          { time: "06:00 PM", activity: "Dinner Break" },
          { time: "08:00 PM", activity: "Mentor Sessions" }
        ]
      },
      {
        day: "Day 2 - June 16, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Continued Development" },
          { time: "12:00 PM", activity: "Lunch & Tech Talks" },
          { time: "02:00 PM", activity: "Mentor Check-ins" },
          { time: "06:00 PM", activity: "Dinner & Networking" },
          { time: "08:00 PM", activity: "Late Night Coding" }
        ]
      },
      {
        day: "Day 3 - June 17, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Final Development Sprint" },
          { time: "12:00 PM", activity: "Submission Deadline" },
          { time: "01:00 PM", activity: "Lunch & Demo Setup" },
          { time: "02:00 PM", activity: "Project Presentations" },
          { time: "04:00 PM", activity: "Judging & Deliberation" },
          { time: "05:00 PM", activity: "Awards Ceremony" },
          { time: "06:00 PM", activity: "Closing & Networking" }
        ]
      }
    ],
    sponsors: [
      { name: "TechCorp", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop" },
      { name: "AI Ventures", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop" },
      { name: "DataFlow", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop" }
    ]
  };

  const handleRegistration = (formData) => {
    // Simulate API call
    setTimeout(() => {
      setIsRegistered(true);
      setIsRegistrationModalOpen(false);
      // Show team formation options after successful registration
      setTimeout(() => {
        setShowProfilePrompt(true);
      }, 1000);
    }, 2000);
  };

  const handleRegisterClick = () => {
    // Check if user profile is complete (mock check)
    const isProfileComplete = Math.random() > 0.5; // 50% chance for demo
    
    if (!isProfileComplete) {
      setShowProfilePrompt(true);
    } else {
      setIsRegistrationModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
          <Link to="/hackathon-listings-screen" className="hover:text-primary transition-colors">
            Hackathons
          </Link>
          <Icon name="ChevronRight" size={16} />
          <span className="text-text-primary">{hackathonData.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <div className="relative h-64 bg-gradient-to-r from-primary to-primary-hover">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathonData.title}</h1>
                    <p className="text-lg opacity-90">Innovate. Create. Transform.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
                    <Image 
                      src={hackathonData.organizerLogo} 
                      alt={hackathonData.organizer}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{hackathonData.organizer}</p>
                    <p className="text-sm text-text-secondary">Event Organizer</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hackathonData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary-light text-primary text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-surface rounded-lg">
                    <Icon name="Calendar" size={20} className="text-primary mx-auto mb-1" />
                    <p className="text-xs text-text-secondary">Duration</p>
                    <p className="text-sm font-medium">3 Days</p>
                  </div>
                  <div className="p-3 bg-surface rounded-lg">
                    <Icon name="Users" size={20} className="text-primary mx-auto mb-1" />
                    <p className="text-xs text-text-secondary">Participants</p>
                    <p className="text-sm font-medium">{hackathonData.participants}/{hackathonData.maxParticipants}</p>
                  </div>
                  <div className="p-3 bg-surface rounded-lg">
                    <Icon name="Award" size={20} className="text-primary mx-auto mb-1" />
                    <p className="text-xs text-text-secondary">Total Prize</p>
                    <p className="text-sm font-medium">{hackathonData.totalPrize}</p>
                  </div>
                  <div className="p-3 bg-surface rounded-lg">
                    <Icon name="MapPin" size={20} className="text-primary mx-auto mb-1" />
                    <p className="text-xs text-text-secondary">Mode</p>
                    <p className="text-sm font-medium">{hackathonData.mode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <CollapsibleSection title="About This Hackathon" defaultOpen={true}>
                <div className="prose max-w-none text-text-secondary">
                  <p>{hackathonData.description}</p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Rules & Guidelines">
                <div className="prose max-w-none text-text-secondary">
                  <div className="whitespace-pre-line">{hackathonData.rules}</div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Judging Criteria">
                <div className="prose max-w-none text-text-secondary">
                  <div className="whitespace-pre-line">{hackathonData.judgingCriteria}</div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Event Schedule">
                <div className="space-y-6">
                  {hackathonData.schedule.map((day, dayIndex) => (
                    <div key={dayIndex}>
                      <h4 className="font-semibold text-text-primary mb-3">{day.day}</h4>
                      <div className="space-y-2">
                        {day.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                            <div className="w-20 text-sm font-medium text-primary">
                              {event.time}
                            </div>
                            <div className="text-text-secondary">
                              {event.activity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Sponsors">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hackathonData.sponsors.map((sponsor, index) => (
                    <div key={index} className="p-4 bg-surface rounded-lg border border-border text-center">
                      <div className="w-full h-16 mb-2 bg-background rounded overflow-hidden flex items-center justify-center">
                        <Image 
                          src={sponsor.logo} 
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-sm font-medium text-text-primary">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EventInfoCard 
              hackathon={hackathonData}
              isRegistered={isRegistered}
              onRegister={handleRegisterClick}
            />

            {/* Prize Breakdown */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="Trophy" size={20} className="text-primary mr-2" />
                Prize Breakdown
              </h3>
              <div className="space-y-3">
                {hackathonData.prizes.map((prize, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">{prize.position}</p>
                      <p className="text-sm text-text-secondary">{prize.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{prize.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Difficulty</span>
                  <span className="font-medium text-text-primary">{hackathonData.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Team Size</span>
                  <span className="font-medium text-text-primary">{hackathonData.teamSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Location</span>
                  <span className="font-medium text-text-primary">{hackathonData.location}</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Share This Event</h3>
              <div className="flex space-x-3">
                <button className="flex-1 flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Icon name="Share" size={16} className="mr-2" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center p-2 bg-surface text-text-primary rounded-lg hover:bg-gray-200 transition-colors border border-border">
                  <Icon name="Bookmark" size={16} className="mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {isRegistrationModalOpen && (
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          onSubmit={handleRegistration}
          hackathonTitle={hackathonData.title}
        />
      )}

      {/* Profile Completion Prompt */}
      {showProfilePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-warning bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={32} className="text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Complete Your Profile</h3>
              <p className="text-text-secondary mb-6">
                Please complete your profile before registering for this hackathon. This helps us match you with the right team members.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowProfilePrompt(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-surface transition-colors"
                >
                  Later
                </button>
                <button
                  onClick={() => {
                    setShowProfilePrompt(false);
                    setIsRegistrationModalOpen(true);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {isRegistered && (
        <div className="fixed bottom-4 right-4 bg-success text-white p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Icon name="CheckCircle" size={20} />
          <span>Successfully registered! Check your email for confirmation.</span>
        </div>
      )}
    </div>
  );
};

export default HackathonDetailsRegistrationScreen;