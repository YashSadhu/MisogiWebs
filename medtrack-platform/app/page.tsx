"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, BarChart3, Download, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import MedicationForm from "@/components/medication-form"
import DoseLogger from "@/components/dose-logger"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import ProfileManager from "@/components/profile-manager"
import ExportManager from "@/components/export-manager"
import NotificationCenter from "@/components/notification-center"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: number
  times: string[]
  category: string
  profileId: string
  startDate: string
  endDate?: string
  instructions?: string
}

interface DoseLog {
  id: string
  medicationId: string
  profileId: string
  scheduledTime: string
  actualTime?: string
  status: "taken" | "missed" | "skipped"
  notes?: string
  timestamp: string
}

interface Profile {
  id: string
  name: string
  relationship: string
  dateOfBirth?: string
  isActive: boolean
}

export default function MedTrackPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [medications, setMedications] = useState<Medication[]>([])
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: "default", name: "My Profile", relationship: "self", isActive: true },
  ])
  const [activeProfile, setActiveProfile] = useState("default")
  const [showMedicationForm, setShowMedicationForm] = useState(false)
  const [upcomingDoses, setUpcomingDoses] = useState<any[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMedications = localStorage.getItem("medtrack-medications")
    const savedDoseLogs = localStorage.getItem("medtrack-dose-logs")
    const savedProfiles = localStorage.getItem("medtrack-profiles")

    if (savedMedications) {
      setMedications(JSON.parse(savedMedications))
    }
    if (savedDoseLogs) {
      setDoseLogs(JSON.parse(savedDoseLogs))
    }
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles))
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("medtrack-medications", JSON.stringify(medications))
  }, [medications])

  useEffect(() => {
    localStorage.setItem("medtrack-dose-logs", JSON.stringify(doseLogs))
  }, [doseLogs])

  useEffect(() => {
    localStorage.setItem("medtrack-profiles", JSON.stringify(profiles))
  }, [profiles])

  // Calculate upcoming doses
  useEffect(() => {
    const now = new Date()
    const upcoming = medications
      .filter((med) => med.profileId === activeProfile)
      .flatMap((med) => {
        return med.times.map((time) => {
          const [hours, minutes] = time.split(":").map(Number)
          const doseTime = new Date()
          doseTime.setHours(hours, minutes, 0, 0)

          // If time has passed today, schedule for tomorrow
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
  }, [medications, activeProfile])

  const addMedication = (medication: Omit<Medication, "id">) => {
    const newMedication = {
      ...medication,
      id: Date.now().toString(),
      profileId: activeProfile,
    }
    setMedications((prev) => [...prev, newMedication])
    setShowMedicationForm(false)
  }

  const logDose = (log: Omit<DoseLog, "id" | "timestamp">) => {
    const newLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      profileId: activeProfile,
    }
    setDoseLogs((prev) => [...prev, newLog])
  }

  const activeMedications = medications.filter((med) => med.profileId === activeProfile)
  const activeProfile_obj = profiles.find((p) => p.id === activeProfile)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">MedTrack</h1>
              <p className="text-gray-600">Medication Adherence & Analytics Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter upcomingDoses={upcomingDoses} />
              <Badge variant="outline" className="px-3 py-1">
                {activeProfile_obj?.name}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Medications</p>
                    <p className="text-2xl font-bold">{activeMedications.length}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Doses</p>
                    <p className="text-2xl font-bold">
                      {activeMedications.reduce((sum, med) => sum + med.frequency, 0)}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Logged Doses</p>
                    <p className="text-2xl font-bold">
                      {doseLogs.filter((log) => log.profileId === activeProfile).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Adherence Rate</p>
                    <p className="text-2xl font-bold">
                      {doseLogs.filter((log) => log.profileId === activeProfile && log.status === "taken").length > 0
                        ? Math.round(
                            (doseLogs.filter((log) => log.profileId === activeProfile && log.status === "taken")
                              .length /
                              doseLogs.filter((log) => log.profileId === activeProfile).length) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Download className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="logger">Log Doses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Doses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Upcoming Doses
                  </CardTitle>
                  <CardDescription>Next scheduled medications</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingDoses.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingDoses.map((dose, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{dose.medicationName}</p>
                            <p className="text-sm text-gray-600">{dose.dosage}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(dose.scheduledTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round(dose.timeUntil / (1000 * 60 * 60))}h{" "}
                              {Math.round((dose.timeUntil % (1000 * 60 * 60)) / (1000 * 60))}m
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No upcoming doses scheduled</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest dose logs</CardDescription>
                </CardHeader>
                <CardContent>
                  {doseLogs
                    .filter((log) => log.profileId === activeProfile)
                    .slice(-5)
                    .reverse().length > 0 ? (
                    <div className="space-y-3">
                      {doseLogs
                        .filter((log) => log.profileId === activeProfile)
                        .slice(-5)
                        .reverse()
                        .map((log) => {
                          const medication = medications.find((med) => med.id === log.medicationId)
                          return (
                            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{medication?.name}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(log.timestamp).toLocaleDateString()} at{" "}
                                  {new Date(log.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  log.status === "taken"
                                    ? "default"
                                    : log.status === "missed"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {log.status}
                              </Badge>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No dose logs yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => setShowMedicationForm(true)} className="h-20 flex flex-col gap-2">
                    <Plus className="w-6 h-6" />
                    Add Medication
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("logger")} className="h-20 flex flex-col gap-2">
                    <Calendar className="w-6 h-6" />
                    Log Dose
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("analytics")}
                    className="h-20 flex flex-col gap-2"
                  >
                    <BarChart3 className="w-6 h-6" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Medications</CardTitle>
                  <CardDescription>Manage your medication regimen</CardDescription>
                </div>
                <Button onClick={() => setShowMedicationForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </Button>
              </CardHeader>
              <CardContent>
                {activeMedications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeMedications.map((medication) => (
                      <Card key={medication.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{medication.name}</h3>
                            <Badge variant="secondary">{medication.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{medication.dosage}</p>
                          <p className="text-sm mb-2">
                            <strong>Frequency:</strong> {medication.frequency}x daily
                          </p>
                          <div className="text-sm">
                            <strong>Times:</strong> {medication.times.join(", ")}
                          </div>
                          {medication.instructions && (
                            <p className="text-xs text-gray-500 mt-2">{medication.instructions}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No medications added yet</p>
                    <Button onClick={() => setShowMedicationForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Medication
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logger">
            <DoseLogger
              medications={activeMedications}
              onLogDose={logDose}
              doseLogs={doseLogs.filter((log) => log.profileId === activeProfile)}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard
              medications={activeMedications}
              doseLogs={doseLogs.filter((log) => log.profileId === activeProfile)}
            />
          </TabsContent>

          <TabsContent value="profiles">
            <ProfileManager
              profiles={profiles}
              activeProfile={activeProfile}
              onProfileChange={setActiveProfile}
              onProfilesUpdate={setProfiles}
            />
          </TabsContent>

          <TabsContent value="export">
            <ExportManager
              medications={activeMedications}
              doseLogs={doseLogs.filter((log) => log.profileId === activeProfile)}
              profileName={activeProfile_obj?.name || "Unknown"}
            />
          </TabsContent>
        </Tabs>

        {/* Medication Form Modal */}
        {showMedicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <MedicationForm onSubmit={addMedication} onCancel={() => setShowMedicationForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
