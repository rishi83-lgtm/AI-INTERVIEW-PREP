import { BrainCircuit } from 'lucide-react';
import PracticeMode from './PracticeMode';
import { analyticalPracticeQuestions } from '../data/practiceBank';

export default function AnalyticalPractice() {
  return (
    <PracticeMode
      title="Analytical practice"
      subtitle="Break down business problems with a structured thinking approach."
      questions={analyticalPracticeQuestions}
      icon={BrainCircuit}
      accent="analytical"
    />
  );
}
