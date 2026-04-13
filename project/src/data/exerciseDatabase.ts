// Simple Exercise Database with MET values for calorie calculation
// MET = calories burned per kg body weight per hour

export interface ExerciseEntry {
  name: string;
  metValue: number; // calories per kg per hour
}

const EXERCISES: ExerciseEntry[] = [
  // Cardio
  { name: 'Running', metValue: 9.8 },
  { name: 'Cycling', metValue: 7.5 },
  { name: 'Walking', metValue: 3.5 },
  { name: 'Jogging', metValue: 7.0 },
  { name: 'Swimming', metValue: 10.0 },
  { name: 'Jumping Rope', metValue: 12.0 },

  // Mind & Body
  { name: 'Yoga', metValue: 3.0 },
  { name: 'Meditation', metValue: 1.3 },
  { name: 'Pilates', metValue: 4.5 },
  { name: 'Stretching', metValue: 2.3 },

  // Strength
  { name: 'Weight Training', metValue: 6.0 },
  { name: 'Push-ups', metValue: 8.0 },
  { name: 'Weight Lifting', metValue: 6.0 },
  { name: 'CrossFit', metValue: 8.5 },

  // Sports
  { name: 'Basketball', metValue: 8.0 },
  { name: 'Tennis', metValue: 8.0 },
  { name: 'Soccer', metValue: 8.5 },
  { name: 'Badminton', metValue: 7.0 },
  { name: 'Volleyball', metValue: 6.0 },
  { name: 'Cricket', metValue: 6.5 },

  // Dance
  { name: 'Dancing', metValue: 7.5 },
  { name: 'Zumba', metValue: 8.0 },
  { name: 'Hip-hop', metValue: 7.5 },
  { name: 'Aerobics', metValue: 7.0 },

  // Outdoor
  { name: 'Climbing', metValue: 8.0 },
  { name: 'Hiking', metValue: 6.5 },
  { name: 'Skating', metValue: 7.0 },
  { name: 'Surfing', metValue: 5.0 },

  // Others
  { name: 'Boxing', metValue: 12.5 },
  { name: 'Martial Arts', metValue: 10.5 },
  { name: 'Elliptical', metValue: 6.5 },
  { name: 'Rowing', metValue: 7.0 },
];

export const getExercises = (): ExerciseEntry[] => EXERCISES;

export const searchExercises = (query: string): ExerciseEntry[] => {
  if (!query) return EXERCISES;
  return EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const getExerciseByName = (name: string): ExerciseEntry | undefined => {
  return EXERCISES.find(ex => ex.name.toLowerCase() === name.toLowerCase());
};

// Calculate calories burned
export const calculateCaloriesBurned = (
  exerciseName: string,
  hours: number,
  minutes: number,
  seconds: number,
  bodyWeight: number = 70
): number => {
  const exercise = getExerciseByName(exerciseName);
  if (!exercise) return 0;

  // Convert to total hours
  const totalHours = hours + (minutes / 60) + (seconds / 3600);
  
  // Calorie formula: MET × body weight (kg) × time (hours)
  const calories = Math.round(exercise.metValue * bodyWeight * totalHours);
  return Math.max(calories, 1);
};
