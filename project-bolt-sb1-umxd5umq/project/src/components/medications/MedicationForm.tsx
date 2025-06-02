import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useMedication } from '../../context/MedicationContext';
import { Medication } from '../../types';
import { getCurrentDate } from '../../utils/dateUtils';

interface MedicationFormProps {
  medicationId: string | null;
  onComplete: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ medicationId, onComplete }) => {
  const { medications, categories, addMedication, updateMedication } = useMedication();
  
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>(['08:00']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Load existing medication data if editing
  useEffect(() => {
    if (medicationId) {
      const medication = medications.find(med => med.id === medicationId);
      if (medication) {
        setName(medication.name);
        setDose(medication.dose);
        setFrequency(medication.frequency);
        setStartDate(medication.startDate);
        setEndDate(medication.endDate);
        setCategoryId(medication.categoryId);
        setTimeSlots([...medication.timeSlots]);
      }
    }
  }, [medicationId, medications]);
  
  // Update time slots when frequency changes
  useEffect(() => {
    if (!medicationId) { // Only auto-adjust for new medications
      const newTimeSlots: string[] = [];
      
      if (frequency === 1) {
        newTimeSlots.push('09:00');
      } else if (frequency === 2) {
        newTimeSlots.push('09:00', '21:00');
      } else if (frequency === 3) {
        newTimeSlots.push('08:00', '14:00', '20:00');
      } else {
        // For higher frequencies, distribute evenly throughout the day
        const interval = 24 / frequency;
        for (let i = 0; i < frequency; i++) {
          const hour = Math.floor(8 + i * interval);
          const formattedHour = hour.toString().padStart(2, '0');
          newTimeSlots.push(`${formattedHour}:00`);
        }
      }
      
      setTimeSlots(newTimeSlots);
    }
  }, [frequency, medicationId]);
  
  const handleTimeSlotChange = (index: number, value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = value;
    setTimeSlots(newTimeSlots);
  };
  
  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, '12:00']);
  };
  
  const handleRemoveTimeSlot = (index: number) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(index, 1);
    setTimeSlots(newTimeSlots);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!name || !dose || !startDate || !endDate || !categoryId) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (timeSlots.length === 0) {
      setError('Please add at least one time slot');
      return;
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const medicationData = {
        name,
        dose,
        frequency,
        startDate,
        endDate,
        categoryId,
        timeSlots,
      };
      
      if (medicationId) {
        await updateMedication({
          ...medicationData,
          id: medicationId,
          userId: '', // This will be overridden by the context
        });
      } else {
        await addMedication(medicationData);
      }
      
      onComplete();
    } catch (err) {
      setError('Failed to save medication');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Medication Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Aspirin"
            required
          />
        </div>
        
        <div>
          <Input
            label="Dose *"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="e.g., 100mg"
            required
          />
        </div>
        
        <div>
          <Select
            label="Category *"
            value={categoryId}
            onChange={(value) => setCategoryId(value)}
            options={[
              { value: '', label: 'Select a category' },
              ...categories.map(cat => ({
                value: cat.id,
                label: cat.name,
              })),
            ]}
            required
          />
        </div>
        
        <div>
          <Select
            label="Frequency (times per day) *"
            value={frequency.toString()}
            onChange={(value) => setFrequency(parseInt(value))}
            options={[
              { value: '1', label: 'Once daily' },
              { value: '2', label: 'Twice daily' },
              { value: '3', label: 'Three times daily' },
              { value: '4', label: 'Four times daily' },
            ]}
            required
          />
        </div>
        
        <div>
          <Input
            label="Start Date *"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Input
            label="End Date *"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Slots *
        </label>
        
        {timeSlots.map((timeSlot, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              type="time"
              value={timeSlot}
              onChange={(e) => handleTimeSlotChange(index, e.target.value)}
              className="mr-2"
            />
            
            {timeSlots.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveTimeSlot(index)}
                className="p-2 text-gray-500 hover:text-red-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={handleAddTimeSlot}
          className="mt-2"
        >
          Add Time Slot
        </Button>
      </div>
      
      <div className="mt-8 flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onComplete}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {medicationId ? 'Update Medication' : 'Add Medication'}
        </Button>
      </div>
    </form>
  );
};

export default MedicationForm;