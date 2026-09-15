import { Code2 } from 'lucide-react';
import PracticeMode from './PracticeMode';
import { codingPracticeQuestions } from '../data/practiceBank';

export default function CodingPractice() {
  return (
    <PracticeMode
      title="Coding practice"
      subtitle="Solve real coding prompts and sharpen your reasoning."
      questions={codingPracticeQuestions}
      icon={Code2}
      accent="coding"
    />
  );
}
