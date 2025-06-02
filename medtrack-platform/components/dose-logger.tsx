"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Check, X, MessageSquare } from "lucide-react"

interface DoseLoggerProps {
  medications: any[]
  onLogDose: (log: any) => void
  doseLogs: any[]
}

export default function DoseLogger({ medications, onLogDose, doseLogs }: DoseLoggerProps) {
  const [selectedMedication, setSelectedMedication] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)

  const logDose = (medicationId: string, status: "taken" | "missed" | "skipped") => {
    const medication = medications.find((med) => med.id === medicationId)
    if (!medication) return

    const now = new Date()
    const log = {
      medicationId,
      scheduledTime: now.toISOString(),
      actualTime: status === "taken" ? now.toISOString() : undefined,
      status,
      notes: notes.trim() || undefined,
    }

    onLogDose(log)
    setNotes("")
    setShowNotes(false)
    setSelectedMedication("")
  }

  const getTodaysLogs = () => {
    const today = new Date().toDateString()
    return doseLogs.filter((log) => new Date(log.timestamp).toDateString() === today)
  }

  const getMedicationLogs = (medicationId: string) => {
    const today = new Date().toDateString()
    return doseLogs.filter(
      (log) => log.medicationId === medicationId && new Date(log.timestamp).toDateString() === today,
    )
  }

  const todaysLogs = getTodaysLogs()

  return (
    <div className="space-y-6">
      {/* Quick Log Section */}
      <Card>
        <CardHeader>
          <CardTitle>Log Dose</CardTitle>
          <CardDescription>Record your medication intake in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          {medications.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medications.map((medication) => {
                  const todayLogs = getMedicationLogs(medication.id)
                  const expectedDoses = medication.frequency
                  const takenDoses = todayLogs.filter((log) => log.status === "taken").length

                  return (
                    <Card key={medication.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{medication.name}</h3>
                            <p className="text-sm text-gray-600">{medication.dosage}</p>
                          </div>
                          <Badge variant="secondary">{medication.category}</Badge>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm">
                            <strong>Progress:</strong> {takenDoses}/{expectedDoses} doses today
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${(takenDoses / expectedDoses) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => logDose(medication.id, "taken")} className="flex-1">
                            <Check className="w-4 h-4 mr-1" />
                            Taken
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => logDose(medication.id, "missed")}>
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMedication(medication.id)
                              setShowNotes(true)
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Notes Modal */}
              {showNotes && selectedMedication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Add Notes</CardTitle>
                      <CardDescription>
                        {medications.find((med) => med.id === selectedMedication)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any notes about this dose..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => logDose(selectedMedication, "taken")} className="flex-1">
                          <Check className="w-4 h-4 mr-2" />
                          Taken
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => logDose(selectedMedication, "missed")}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Missed
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowNotes(false)
                          setSelectedMedication("")
                          setNotes("")
                        }}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No medications to log. Add medications first.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Activity</CardTitle>
          <CardDescription>All dose logs for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todaysLogs.length > 0 ? (
            <div className="space-y-3">
              {todaysLogs.map((log) => {
                const medication = medications.find((med) => med.id === log.medicationId)
                return (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                        <p className="font-medium">{medication?.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {log.notes && <p className="text-xs text-gray-500 mt-1">{log.notes}</p>}
                      </div>
                    </div>
                    <Badge
                      variant={
                        log.status === "taken" ? "default" : log.status === "missed" ? "destructive" : "secondary"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No doses logged today</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
