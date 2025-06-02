"use client"

import { useState, useEffect, useCallback } from "react"
import { DatabaseService, DatabaseError } from "@/lib/database"
import type { Profile, Medication, DoseLog, Reward } from "@/lib/database"

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DatabaseService.getProfiles()
      setProfiles(data)
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to fetch profiles"
      setError(message)
      console.error("Error fetching profiles:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfile = useCallback(async (profile: Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      setError(null)
      const newProfile = await DatabaseService.createProfile(profile)
      setProfiles((prev) => [...prev, newProfile])
      return newProfile
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to create profile"
      setError(message)
      throw err
    }
  }, [])

  const updateProfile = useCallback(async (id: string, updates: Partial<Profile>) => {
    try {
      setError(null)
      const updatedProfile = await DatabaseService.updateProfile(id, updates)
      setProfiles((prev) => prev.map((p) => (p.id === id ? updatedProfile : p)))
      return updatedProfile
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to update profile"
      setError(message)
      throw err
    }
  }, [])

  const deleteProfile = useCallback(async (id: string) => {
    try {
      setError(null)
      await DatabaseService.deleteProfile(id)
      setProfiles((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to delete profile"
      setError(message)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
  }
}

export function useMedications(profileId?: string) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DatabaseService.getMedications(profileId)
      setMedications(data)
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to fetch medications"
      setError(message)
      console.error("Error fetching medications:", err)
    } finally {
      setLoading(false)
    }
  }, [profileId])

  const createMedication = useCallback(
    async (medication: Omit<Medication, "id" | "user_id" | "created_at" | "updated_at">) => {
      try {
        setError(null)
        const newMedication = await DatabaseService.createMedication(medication)
        setMedications((prev) => [...prev, newMedication])
        return newMedication
      } catch (err) {
        const message = err instanceof DatabaseError ? err.message : "Failed to create medication"
        setError(message)
        throw err
      }
    },
    [],
  )

  const updateMedication = useCallback(async (id: string, updates: Partial<Medication>) => {
    try {
      setError(null)
      const updatedMedication = await DatabaseService.updateMedication(id, updates)
      setMedications((prev) => prev.map((m) => (m.id === id ? updatedMedication : m)))
      return updatedMedication
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to update medication"
      setError(message)
      throw err
    }
  }, [])

  const deleteMedication = useCallback(async (id: string) => {
    try {
      setError(null)
      await DatabaseService.deleteMedication(id)
      setMedications((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to delete medication"
      setError(message)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchMedications()
  }, [fetchMedications])

  return {
    medications,
    loading,
    error,
    refetch: fetchMedications,
    createMedication,
    updateMedication,
    deleteMedication,
  }
}

export function useDoseLogs(profileId?: string, medicationId?: string) {
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDoseLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DatabaseService.getDoseLogs(profileId, medicationId)
      setDoseLogs(data)
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to fetch dose logs"
      setError(message)
      console.error("Error fetching dose logs:", err)
    } finally {
      setLoading(false)
    }
  }, [profileId, medicationId])

  const createDoseLog = useCallback(async (doseLog: Omit<DoseLog, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      setError(null)
      const newDoseLog = await DatabaseService.createDoseLog(doseLog)
      setDoseLogs((prev) => [newDoseLog, ...prev])
      return newDoseLog
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to create dose log"
      setError(message)
      throw err
    }
  }, [])

  const updateDoseLog = useCallback(async (id: string, updates: Partial<DoseLog>) => {
    try {
      setError(null)
      const updatedDoseLog = await DatabaseService.updateDoseLog(id, updates)
      setDoseLogs((prev) => prev.map((d) => (d.id === id ? updatedDoseLog : d)))
      return updatedDoseLog
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to update dose log"
      setError(message)
      throw err
    }
  }, [])

  const deleteDoseLog = useCallback(async (id: string) => {
    try {
      setError(null)
      await DatabaseService.deleteDoseLog(id)
      setDoseLogs((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to delete dose log"
      setError(message)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchDoseLogs()
  }, [fetchDoseLogs])

  return {
    doseLogs,
    loading,
    error,
    refetch: fetchDoseLogs,
    createDoseLog,
    updateDoseLog,
    deleteDoseLog,
  }
}

export function useRewards(profileId: string) {
  const [rewards, setRewards] = useState<Reward | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRewards = useCallback(async () => {
    if (!profileId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await DatabaseService.getRewards(profileId)
      setRewards(data)
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to fetch rewards"
      setError(message)
      console.error("Error fetching rewards:", err)
    } finally {
      setLoading(false)
    }
  }, [profileId])

  const updateRewards = useCallback(async (updates: Omit<Reward, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      setError(null)
      const updatedRewards = await DatabaseService.upsertRewards(updates)
      setRewards(updatedRewards)
      return updatedRewards
    } catch (err) {
      const message = err instanceof DatabaseError ? err.message : "Failed to update rewards"
      setError(message)
      console.error("Error updating rewards:", err)
      throw err
    }
  }, [])

  useEffect(() => {
    if (profileId) {
      fetchRewards()
    }
  }, [fetchRewards, profileId])

  return {
    rewards,
    loading,
    error,
    refetch: fetchRewards,
    updateRewards,
  }
}
