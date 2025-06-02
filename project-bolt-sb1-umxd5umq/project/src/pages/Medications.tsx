import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useMedication } from '../context/MedicationContext';
import { formatDate } from '../utils/dateUtils';
import MedicationForm from '../components/medications/MedicationForm';
import CategoryBadge from '../components/medications/CategoryBadge';

const Medications: React.FC = () => {
  const { medications, categories, deleteMedication, isLoading } = useMedication();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      await deleteMedication(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Medications</h1>
          <p className="text-gray-600">Manage your medication regimen</p>
        </div>
        <Button
          onClick={() => {
            setEditingMedication(null);
            setShowAddForm(!showAddForm);
          }}
          leftIcon={<Plus size={16} />}
        >
          Add Medication
        </Button>
      </div>

      {/* Add/Edit Medication Form */}
      {(showAddForm || editingMedication) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingMedication ? 'Edit Medication' : 'Add New Medication'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MedicationForm
              medicationId={editingMedication}
              onComplete={() => {
                setShowAddForm(false);
                setEditingMedication(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.length > 0 ? (
          medications.map((medication) => {
            const category = categories.find(
              (cat) => cat.id === medication.categoryId
            );

            return (
              <Card key={medication.id} className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {medication.name}
                      </h3>
                      <p className="text-gray-600">{medication.dose}</p>
                      
                      {category && (
                        <div className="mt-2">
                          <CategoryBadge category={category} />
                        </div>
                      )}
                      
                      <div className="flex items-center mt-4 text-gray-600">
                        <Clock size={16} className="mr-1" />
                        <span>
                          {medication.frequency}x daily (
                          {medication.timeSlots.map((slot) => formatDate(slot)).join(', ')})
                        </span>
                      </div>
                      
                      <div className="flex items-center mt-2 text-gray-600">
                        <Calendar size={16} className="mr-1" />
                        <span>
                          {formatDate(medication.startDate)} to{' '}
                          {formatDate(medication.endDate)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMedication(medication.id)}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(medication.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">
                  You haven't added any medications yet
                </p>
                <Button
                  onClick={() => {
                    setEditingMedication(null);
                    setShowAddForm(true);
                  }}
                  leftIcon={<Plus size={16} />}
                >
                  Add Your First Medication
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medications;