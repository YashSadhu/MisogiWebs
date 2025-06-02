
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import HackathonCard from "@/components/HackathonCard";
import Hero from "@/components/Hero";

const Index = () => {
  const featuredHackathons = [
    {
      id: 1,
      title: "Future AI Innovators 2025",
      theme: "Next-Gen AI & Robotics",
      startDate: "2025-06-10",
      endDate: "2025-06-12",
      registrationDeadline: "2025-06-01",
      location: "Bengaluru, India",
      prizes: "₹1,000,000",
      tags: ["AI", "Robotics", "Deep Learning"],
      participants: 450,
      teamsFormed: 110,
      description: "Dive into the future of intelligence. Create groundbreaking solutions with AI and robotics.",
      image: "photo-1581092795360-fd1ca04f0952"
    },
    {
      id: 2,
      title: "Decentralized India Summit",
      theme: "Blockchain & Web3 Applications",
      startDate: "2025-07-05",
      endDate: "2025-07-07",
      registrationDeadline: "2025-06-28",
      location: "Hyderabad, India",
      prizes: "₹750,000",
      tags: ["Web3", "Blockchain", "NFTs", "Metaverse"],
      participants: 320,
      teamsFormed: 80,
      description: "Explore the potential of decentralized technologies and build the next wave of Web3 innovation for India.",
      image: "photo-1498050108023-c5249f4df085"
    },
    {
      id: 3,
      title: "Eco-Warriors Challenge",
      theme: "Sustainable & Green Technology",
      startDate: "2025-08-15",
      endDate: "2025-08-17",
      registrationDeadline: "2025-08-05",
      location: "Pune, India",
      prizes: "₹500,000",
      tags: ["Sustainability", "GreenTech", "Circular Economy"],
      participants: 280,
      teamsFormed: 70,
      description: "Address pressing environmental issues with technology. Innovate for a greener tomorrow.",
      image: "photo-1519389950473-47ba0277781c"
    },
    {
      id: 4,
      title: "HealthTech Revolution",
      theme: "Healthcare Innovation",
      startDate: "2025-09-01",
      endDate: "2025-09-03",
      registrationDeadline: "2025-08-20",
      location: "Mumbai, India",
      prizes: "₹800,000",
      tags: ["HealthTech", "MedTech", "Digital Health"],
      participants: 380,
      teamsFormed: 90,
      description: "Transform healthcare with technology. Develop solutions for better patient outcomes and accessibility.",
      image: "photo-1576091160550-2173dba999ef" // Example image, replace with actual
    },
    {
      id: 5,
      title: "FinTech Forward 2025",
      theme: "Financial Technology & Innovation",
      startDate: "2025-10-10",
      endDate: "2025-10-12",
      registrationDeadline: "2025-09-30",
      location: "Delhi, India",
      prizes: "₹900,000",
      tags: ["FinTech", "Digital Payments", "InsurTech"],
      participants: 400,
      teamsFormed: 100,
      description: "Reshape the financial landscape with innovative tech solutions. Drive the future of finance.",
      image: "photo-1553729459-efe14ef6055d" // Example image, replace with actual
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navigation />
      <Hero />
      
      {/* Featured Hackathons Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Featured Hackathons
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing hackathons happening around the world. Join innovators, creators, and builders in shaping the future.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600">Active Hackathons</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Participants</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600">12K+</div>
              <div className="text-gray-600">Teams Formed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-cyan-600">$2M+</div>
              <div className="text-gray-600">Prize Money</div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Index;
