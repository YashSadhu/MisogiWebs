"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Calendar,
  BarChart3,
  Bell,
  User,
  LogOut,
  Download,
  Loader2,
  Pill,
  ListChecks,
  Activity,
  Trophy,
  Star,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MedicationForm from "@/components/medication-form"
import DoseLogger from "@/components/dose-logger"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import ProfileManager from "@/components/profile-manager"
import ExportManager from "@/components/export-manager"
import NotificationCenter from "@/components/notification-center"
import RewardsCenter from "@/components/rewards-center"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import DoseNotificationPopup from "@/components/dose-notification-popup"
import { useProfiles, useMedications, useDoseLogs, useRewards } from "@/hooks/use-database"
import { DatabaseError } from "@/lib/database"
import type { DoseLog } from "@/lib/database"

export default function MedTrackDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [activeProfile, setActiveProfile] = useState<string>("")
  const [showMedicationForm, setShowMedicationForm] = useState(false)
  const [upcomingDoses, setUpcomingDoses] = useState<any[]>([])
  const [showRewards, setShowRewards] = useState(false)
  const [showProfileManager, setShowProfileManager] = useState(false)
  const [showExportManager, setShowExportManager] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showFirstLogCelebration, setShowFirstLogCelebration] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // Database hooks
  const {
    profiles,
    loading: profilesLoading,
    error: profilesError,
    createProfile,
    updateProfile,
    deleteProfile,
  } = useProfiles()
  const {
    medications,
    loading: medicationsLoading,
    error: medicationsError,
    createMedication,
    updateMedication,
    deleteMedication,
  } = useMedications(activeProfile)
  const {
    doseLogs,
    loading: doseLogsLoading,
    error: doseLogsError,
    createDoseLog,
    updateDoseLog,
    deleteDoseLog,
    refetch: refetchDoseLogs,
  } = useDoseLogs(activeProfile)
  const { rewards, loading: rewardsLoading, error: rewardsError, updateRewards } = useRewards(activeProfile)

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          router.push("/")
          return
        }
        setUser(session.user)
      } catch (error) {
        console.error("Auth check error:", error)
        setError("Authentication error. Please try signing in again.")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/")
        return
      }
      setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Set active profile when profiles load
  useEffect(() => {
    if (profiles.length > 0 && !activeProfile) {
      // Try to find a profile marked as active, or use the first one
      const defaultProfile = profiles.find((p) => p.is_active) || profiles[0]
      setActiveProfile(defaultProfile.id)
    }
  }, [profiles, activeProfile])

  // Create default profile for new users
  useEffect(() => {
    const createDefaultProfile = async () => {
      if (user && profiles.length === 0 && !profilesLoading && !profilesError) {
        try {
          await createProfile({
            name: user.user_metadata?.name || "My Profile",
            relationship: "Self",
            is_active: true,
          })
        } catch (error) {
          console.error("Error creating default profile:", error)
        }
      }
    }

    createDefaultProfile()
  }, [user, profiles, profilesLoading, profilesError, createProfile])

  // Calculate upcoming doses
  useEffect(() => {
    if (!medications.length) {
      setUpcomingDoses([])
      return
    }

    const now = new Date()
    const upcoming = medications
      .flatMap((med) => {
        return med.times.map((time) => {
          const [hours, minutes] = time.split(":").map(Number)
          const doseTime = new Date()
          doseTime.setHours(hours, minutes, 0, 0)

          if (doseTime <= now) {
            doseTime.setDate(doseTime.getDate() + 1)
          }

          return {
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            scheduledTime: doseTime.toISOString(),
            timeUntil: doseTime.getTime() - now.getTime(),
          }
        })
      })
      .sort((a, b) => a.timeUntil - b.timeUntil)
      .slice(0, 5)

    setUpcomingDoses(upcoming)
  }, [medications])

  const addMedication = async (medicationData: any) => {
    try {
      await createMedication({
        profile_id: activeProfile,
        name: medicationData.name,
        dosage: medicationData.dosage,
        frequency: medicationData.frequency,
        times: medicationData.times,
        category: medicationData.category as any,
        start_date: medicationData.startDate,
        end_date: medicationData.endDate || null,
        instructions: medicationData.instructions || null,
        is_active: true,
      })
      setShowMedicationForm(false)
    } catch (error) {
      console.error("Error adding medication:", error)
      setError(error instanceof DatabaseError ? error.message : "Failed to add medication")
    }
  }

  const logDose = async (logData: any) => {
    try {
      const medication = medications.find((med) => med.id === logData.medicationId)
      if (!medication) {
        throw new Error("Medication not found")
      }

      // Check if user has already logged all doses for today
      const today = new Date().toDateString()
      const todayTakenLogs = doseLogs.filter(
        (log) =>
          log.medication_id === logData.medicationId &&
          new Date(log.created_at).toDateString() === today &&
          log.status === "taken",
      )

      if (logData.status === "taken" && todayTakenLogs.length >= medication.frequency) {
        setError(`You've already logged all ${medication.frequency} doses for ${medication.name} today.`)
        return
      }

      const newLog = await createDoseLog({
        medication_id: logData.medicationId,
        profile_id: activeProfile,
        scheduled_time: logData.scheduledTime,
        actual_time: logData.actualTime || null,
        status: logData.status,
        notes: logData.notes || null,
        is_late: logData.isLate || false,
        minutes_late: logData.minutesLate || 0,
      })

      // Always refetch dose logs after logging
      await refetchDoseLogs();

      if (logData.status === "taken") {
        await calculateRewards(newLog)
      }
    } catch (error) {
      console.error("Error logging dose:", error)
      setError(error instanceof DatabaseError ? error.message : "Failed to log dose")
    }
  }

  const calculateRewards = async (log: DoseLog) => {
    try {
      const currentRewards = rewards || {
        profile_id: activeProfile,
        points: 0,
        streak: 0,
        level: 1,
        achievements: [],
        last_log_date: null,
        has_first_log: false,
      }

      const today = new Date().toDateString()
      const logDate = new Date(log.created_at).toDateString()

      let newPoints = currentRewards.points
      let newStreak = currentRewards.streak
      const newAchievements = [...currentRewards.achievements]
      const isFirstLog = !currentRewards.has_first_log

      // First log bonus
      if (isFirstLog) {
        newPoints += 50
        newAchievements.push("first-log")
        setShowFirstLogCelebration(true)
        setTimeout(() => setShowFirstLogCelebration(false), 3000)
      }

      // Base points for taking medication
      newPoints += 10

      // Bonus points for on-time doses
      if (!log.is_late) {
        newPoints += 5
      }

      // Streak calculation
      if (currentRewards.last_log_date !== logDate) {
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        if (currentRewards.last_log_date === yesterday) {
          newStreak += 1
        } else {
          newStreak = 1
        }
      }

      // Streak bonus points
      if (newStreak >= 7) newPoints += 20
      if (newStreak >= 30) newPoints += 50

      // Level calculation
      const newLevel = Math.floor(newPoints / 100) + 1

      // Achievement checks
      if (newStreak === 7 && !newAchievements.includes("week-streak")) {
        newAchievements.push("week-streak")
        newPoints += 50
      }
      if (newStreak === 30 && !newAchievements.includes("month-streak")) {
        newAchievements.push("month-streak")
        newPoints += 100
      }
      if (newPoints >= 500 && !newAchievements.includes("points-500")) {
        newAchievements.push("points-500")
      }

      // Update rewards with proper data structure
      await updateRewards({
        profile_id: activeProfile,
        points: newPoints,
        streak: newStreak,
        level: newLevel,
        achievements: newAchievements,
        last_log_date: logDate,
        has_first_log: true,
      })
    } catch (error) {
      console.error("Error calculating rewards:", error)
      // Don't throw the error to prevent blocking the dose logging
      setError("Rewards calculation failed, but dose was logged successfully")
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleProfileChange = (profileId: string) => {
    setActiveProfile(profileId)
    setShowProfileManager(false)
  }

  if (loading || profilesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 gradient-primary-light rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading MedTrack...</h2>
          <p className="text-gray-600 mt-2">Preparing your medication dashboard</p>
        </div>
      </div>
    )
  }

  const activeProfileObj = profiles.find((p) => p.id === activeProfile)
  const currentRewards = rewards || {
    points: 0,
    streak: 0,
    level: 1,
    achievements: [],
    has_first_log: false,
  }

  // Show any database errors
  const dbError = profilesError || medicationsError || doseLogsError || rewardsError || error

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      {/* Database Error Alert */}
      {dbError && (
        <Alert className="mx-6 mt-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{dbError}</AlertDescription>
        </Alert>
      )}

      {/* First Log Celebration */}
      {showFirstLogCelebration && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-3d p-8 max-w-md mx-4 text-center first-log-celebration">
            <div className="w-20 h-20 mx-auto mb-4 gradient-success-solid rounded-full flex items-center justify-center">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 First Log Bonus!</h2>
            <p className="text-gray-600 mb-4">Congratulations on your first dose log! You've earned 50 bonus points.</p>
            <div className="gradient-primary-light p-3 rounded-lg">
              <p className="text-blue-700 font-semibold">+50 Points Earned!</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Refined Header */}
        <div className="mb-8 fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                MedTrack
              </h1>
              <p className="text-lg text-gray-600 font-medium">Medication Adherence Platform</p>
              {user && (
                <p className="text-sm text-gray-500 gradient-primary-light px-3 py-1 rounded-full inline-block">
                  Welcome back, {user.user_metadata?.name || user.email}! ✨
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter upcomingDoses={upcomingDoses} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="btn-primary px-6">
                    <User className="w-4 h-4 mr-2" />
                    <span>{activeProfileObj?.name || "Select Profile"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="card-3d border-0 p-2">
                  <DropdownMenuLabel className="text-gray-700">Profile Management</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={() => setShowProfileManager(true)}
                    className="rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Manage Profiles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowRewards(true)}
                    className="rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Trophy className="w-4 h-4 mr-2 text-blue-500" />
                    View Rewards
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Refined Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card-3d p-6 group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Medications</p>
                  <p className="text-3xl font-bold text-gray-800">{medications.length}</p>
                  <p className="text-xs text-blue-600 mt-1">Ready to track</p>
                </div>
                <div className="w-14 h-14 gradient-primary-solid rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Pill className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="card-3d p-6 group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Today's Doses</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {medications.reduce((sum, med) => sum + med.frequency, 0)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Scheduled</p>
                </div>
                <div className="w-14 h-14 gradient-success-solid rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ListChecks className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="card-3d p-6 group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Logged Doses</p>
                  <p className="text-3xl font-bold text-gray-800">{doseLogs.length}</p>
                  <p className="text-xs text-blue-600 mt-1">Total recorded</p>
                </div>
                <div className="w-14 h-14 gradient-primary-light rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                  <Activity className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div
              className="card-3d p-6 group hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setShowRewards(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Rewards Level</p>
                  <p className="text-3xl font-bold text-gray-800">{currentRewards.level}</p>
                  <p className="text-xs text-yellow-600 mt-1">{currentRewards.points} points</p>
                </div>
                <div className="w-14 h-14 gradient-warning-solid rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refined Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 card-3d p-2 bg-white/80 h-12">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all h-8 flex items-center justify-center"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="medications"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all h-8 flex items-center justify-center"
            >
              Medications
            </TabsTrigger>
            <TabsTrigger
              value="logger"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all h-8 flex items-center justify-center"
            >
              Log Doses
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all h-8 flex items-center justify-center"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Doses */}
              <Card className="card-3d border-0">
                <CardHeader className="gradient-primary-solid text-white rounded-t-2xl">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    Upcoming Doses
                  </CardTitle>
                  <CardDescription className="text-blue-100">Next scheduled medications</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {upcomingDoses.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingDoses.map((dose, index) => (
                        <div
                          key={index}
                          className="gradient-primary-light p-4 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 gradient-primary-solid rounded-full flex items-center justify-center">
                                <Pill className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{dose.medicationName}</p>
                                <p className="text-sm text-gray-600">{dose.dosage}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-blue-600">
                                {new Date(dose.scheduledTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <p className="text-xs text-gray-500">
                                in {Math.round(dose.timeUntil / (1000 * 60 * 60))}h{" "}
                                {Math.round((dose.timeUntil % (1000 * 60 * 60)) / (1000 * 60))}m
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 gradient-neutral-light rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                        <Bell className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No upcoming doses scheduled</p>
                      <p className="text-sm text-gray-400">You're all caught up! 🎉</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-3d border-0">
                <CardHeader className="gradient-success-solid text-white rounded-t-2xl">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-green-100">Latest dose logs</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {doseLogs.slice(0, 5).length > 0 ? (
                    <div className="space-y-4">
                      {doseLogs.slice(0, 5).map((log) => {
                        const medication = medications.find((med) => med.id === log.medication_id)
                        return (
                          <div
                            key={log.id}
                            className="gradient-success-light p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    log.status === "taken"
                                      ? "bg-green-500"
                                      : log.status === "missed"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                                  }`}
                                />
                                <div>
                                  <p className="font-semibold text-gray-800">{medication?.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(log.created_at).toLocaleDateString()} at{" "}
                                    {new Date(log.created_at).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={`${
                                  log.status === "taken"
                                    ? "bg-green-500 text-white border-0"
                                    : log.status === "missed"
                                      ? "bg-red-500 text-white border-0"
                                      : "bg-yellow-500 text-white border-0"
                                }`}
                              >
                                {log.status}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 gradient-neutral-light rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                        <Activity className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No dose logs yet</p>
                      <p className="text-sm text-gray-400">Start logging to see your activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="card-3d border-0">
              <CardHeader className="gradient-primary-light rounded-t-2xl border-b border-blue-200">
                <CardTitle className="text-blue-800">Quick Actions</CardTitle>
                <CardDescription className="text-blue-600">Get started with these common tasks</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Button
                    onClick={() => setShowMedicationForm(true)}
                    className="h-24 btn-primary flex flex-col gap-3 group"
                  >
                    <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Add Medication</span>
                  </Button>
                  <Button onClick={() => setActiveTab("logger")} className="h-24 btn-light flex flex-col gap-3 group">
                    <Calendar className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Log Dose</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("analytics")}
                    className="h-24 btn-light flex flex-col gap-3 group"
                  >
                    <BarChart3 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="scale-in">
            <Card className="card-3d border-0">
              <CardHeader className="gradient-primary-solid text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Pill className="w-5 h-5" />
                      </div>
                      Medications
                    </CardTitle>
                    <CardDescription className="text-blue-100">Manage your medication regimen</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowMedicationForm(true)}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {medications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medications.map((medication) => (
                      <Card
                        key={medication.id}
                        className="card-3d border-l-4 border-l-blue-500 hover:scale-105 transition-transform duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-bold text-lg text-gray-800">{medication.name}</h3>
                            <Badge className="bg-blue-500 text-white border-0">{medication.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3 font-medium">{medication.dosage}</p>
                          <p className="text-sm mb-3">
                            <strong className="text-gray-700">Frequency:</strong> {medication.frequency}x daily
                          </p>
                          <div className="text-sm mb-4">
                            <strong className="text-gray-700">Times:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {medication.times.map((time, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600">
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {medication.instructions && (
                            <p className="text-xs text-gray-500 gradient-neutral-light p-2 rounded-lg border border-gray-200">
                              {medication.instructions}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 gradient-neutral-light rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                      <Pill className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4 text-lg font-medium">No medications added yet</p>
                    <p className="text-gray-400 mb-6">Start by adding your first medication to begin tracking</p>
                    <Button onClick={() => setShowMedicationForm(true)} className="btn-primary px-8 py-3">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Medication
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logger" className="scale-in">
            <DoseLogger medications={medications} onLogDose={logDose} doseLogs={doseLogs} rewards={currentRewards} />
          </TabsContent>

          <TabsContent value="analytics" className="scale-in">
            <AnalyticsDashboard medications={medications} doseLogs={doseLogs} />

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setShowExportManager(true)} className="btn-primary px-6 py-3">
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Modals */}
        {showRewards && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card-3d max-w-2xl w-full max-h-[90vh] overflow-y-auto border-0 scale-in">
              <RewardsCenter rewards={currentRewards} onClose={() => setShowRewards(false)} doseLogs={doseLogs} />
            </div>
          </div>
        )}

        {showProfileManager && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card-3d max-w-4xl w-full max-h-[90vh] overflow-y-auto border-0 scale-in">
              <ProfileManager
                profiles={profiles}
                activeProfile={activeProfile}
                onProfileChange={handleProfileChange}
                onProfilesUpdate={() => {}} // This will be handled by the database hooks
              />
              <div className="p-6 flex justify-end border-t border-gray-200">
                <Button onClick={() => setShowProfileManager(false)} className="btn-light">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {showExportManager && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card-3d max-w-4xl w-full max-h-[90vh] overflow-y-auto border-0 scale-in">
              <ExportManager
                medications={medications}
                doseLogs={doseLogs}
                profileName={activeProfileObj?.name || "Unknown"}
              />
              <div className="p-6 flex justify-end border-t border-gray-200">
                <Button onClick={() => setShowExportManager(false)} className="btn-light">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {showMedicationForm && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card-3d max-w-2xl w-full max-h-[90vh] overflow-y-auto border-0 scale-in">
              <MedicationForm onSubmit={addMedication} onCancel={() => setShowMedicationForm(false)} />
            </div>
          </div>
        )}

        <DoseNotificationPopup
          onLogDose={(medicationId, status) => {
            const medication = medications.find((med) => med.id === medicationId)
            if (medication) {
              logDose({
                medicationId,
                scheduledTime: new Date().toISOString(),
                actualTime: status === "taken" ? new Date().toISOString() : undefined,
                status,
                isLate: false,
                minutesLate: 0,
              })
            }
          }}
          medications={medications}
          doseLogs={doseLogs}
        />
      </div>
    </div>
  )
}
