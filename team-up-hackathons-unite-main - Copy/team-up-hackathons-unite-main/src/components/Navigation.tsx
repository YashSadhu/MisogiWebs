import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users, Calendar, Bell, LogOut, User, Bookmark } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import HackMapLogo from './HackMapLogo';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from '@/stores/notificationStore';
import NotificationPanel from './NotificationPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHackathonStore } from '@/stores/hackathonStore';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { savedHackathons } = useHackathonStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Define navigation items based on auth status
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        path: '/dashboard',
        show: true
      }
    ];

    const authenticatedItems = [
      {
        label: 'My Events',
        path: '/my-events',
        show: true
      },
      {
        label: 'Teams',
        path: '/find-team',
        show: true
      },
      {
        label: 'Projects',
        path: '/projects',
        show: true
      }
    ];

    return [...baseItems, ...(user ? authenticatedItems : [])];
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <HackMapLogo />

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {getNavigationItems().map((item) => (
                item.show && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => navigate('/saved-hackathons')}
                  >
                    <Bookmark className="h-5 w-5" />
                    {savedHackathons.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {savedHackathons.length}
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden md:flex relative"
                    onClick={toggleNotifications}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="hidden md:inline">{user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={() => navigate('/auth')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};

export default Navigation;
