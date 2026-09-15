export const codingPracticeQuestions = [
  {
    id: 'reverse-string',
    category: 'Coding',
    title: 'Reverse a string without using built-in reverse',
    level: 'Easy',
    summary: 'String manipulation and edge cases',
    prompt: 'Write a function that reverses a string and explain how it behaves with empty input, single-character input, and Unicode characters. Mention the time complexity and any trade-offs.',
    placeholder: 'Explain your approach step by step and include edge cases.',
    focus: [
      'Handle empty and single-character strings.',
      'Explain the algorithm clearly before code.',
      'Mention time complexity and memory use.'
    ]
  },
  {
    id: 'two-sum',
    category: 'Coding',
    title: 'Find a pair that adds up to a target',
    level: 'Medium',
    summary: 'Hash map technique',
    prompt: 'Given an array of integers and a target sum, return the indices of the two numbers that add up to the target. If multiple solutions exist, return any valid pair. Walk through your reasoning and complexity.',
    placeholder: 'Write the algorithm, then describe why the hash map approach is efficient.',
    focus: [
      'Describe the idea before implementation.',
      'Show how the map stores complements.',
      'Discuss O(n) time and O(n) space.'
    ]
  },
  {
    id: 'palindrome',
    category: 'Coding',
    title: 'Check whether a string is a palindrome',
    level: 'Medium',
    summary: 'Two-pointer technique',
    prompt: 'Create a function that checks whether a string is a palindrome, ignoring case and spaces. Describe your approach and explain how you would test tricky inputs.',
    placeholder: 'Include both the logic and sample test cases.',
    focus: [
      'Ignore spaces and letter casing.',
      'Use a two-pointer or reverse comparison.',
      'Mention edge cases like empty strings and repeated characters.'
    ]
  }
];

export const analyticalPracticeQuestions = [
  {
    id: 'conversion-drop',
    category: 'Analytical',
    title: 'Conversion rate dropped from 8% to 4.5%',
    level: 'Medium',
    summary: 'Measure root cause and action plan',
    prompt: 'A SaaS product saw conversion drop by 43% after releasing a new checkout page. Describe the first three analyses you would run, which metrics matter most, and how you would decide whether the issue is product, traffic, or UX-related.',
    placeholder: 'Give a structured diagnosis with metrics, hypotheses, and next steps.',
    focus: [
      'Compare traffic, funnel, and user behavior changes.',
      'Look for product, device, and acquisition signals.',
      'Prioritize experiments with clear success criteria.'
    ]
  },
  {
    id: 'churn-signal',
    category: 'Analytical',
    title: 'Customer churn is rising in the first 30 days',
    level: 'Medium',
    summary: 'Cohort analysis and retention diagnosis',
    prompt: 'A subscription product is seeing higher churn within the first month. Explain how you would identify the likely causes, evaluate the quality of the onboarding flow, and propose experiments to reduce churn.',
    placeholder: 'Break the answer into diagnosis, hypotheses, and experiments.',
    focus: [
      'Segment users by cohort and behavior.',
      'Check onboarding friction and activation metrics.',
      'Link churn to product value and retention signals.'
    ]
  },
  {
    id: 'pricing-test',
    category: 'Analytical',
    title: 'A pricing experiment produced mixed results',
    level: 'Hard',
    summary: 'Experiment design and business trade-offs',
    prompt: 'Your team increased prices for a paid feature and saw revenue rise for enterprise users but conversion decline for SMB users. How would you decide whether the new pricing is actually better, and what evidence would you collect before rolling it out?',
    placeholder: 'Discuss trade-offs, metrics, and decision criteria clearly.',
    focus: [
      'Separate value, conversion, and retention effects.',
      'Use segment-level analysis rather than aggregate totals.',
      'Define the success criteria for the business decision.'
    ]
  }
];
