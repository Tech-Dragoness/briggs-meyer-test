const questions = [
  { 
    text: 'I enjoy spending time with large groups of people.', 
    writeOnly: false,
    disagreeLabel: 'Not my thing',
    agreeLabel: 'Love it',
    mbti: 'E/I',
    scoring: { 'E': [6, 10], 'I': [1, 5] }
  },
  { 
    text: 'I prefer to focus on the present moment.', 
    writeOnly: false,
    disagreeLabel: 'Not at all',
    agreeLabel: 'Very much',
    mbti: 'N/S',
    scoring: { 'S': [6, 10], 'N': [1, 5] }
  },
  { 
    text: 'I make decisions based on logical analysis.', 
    writeOnly: false,
    disagreeLabel: 'Rarely',
    agreeLabel: 'Always',
    mbti: 'T/F',
    scoring: { 'T': [6, 10], 'F': [1, 5] }
  },
  { 
    text: 'I like to keep my schedule flexible.', 
    writeOnly: false,
    disagreeLabel: 'Prefer structure',
    agreeLabel: 'Love flexibility',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'I feel energized after social events.', 
    writeOnly: false,
    disagreeLabel: 'Drained',
    agreeLabel: 'Energized',
    mbti: 'E/I',
    scoring: { 'E': [6, 10], 'I': [1, 5] }
  },
  { 
    text: 'I often think about the future and what it might hold.', 
    writeOnly: false,
    disagreeLabel: 'Not often',
    agreeLabel: 'Constantly',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I enjoy solving complex problems.', 
    writeOnly: false,
    disagreeLabel: 'Not my strength',
    agreeLabel: 'Love challenges',
    mbti: 'T/F',
    scoring: { 'T': [6, 10], 'F': [1, 5] }
  },
  { 
    text: 'I prefer to work independently rather than in a team.', 
    writeOnly: false,
    disagreeLabel: 'Teamwork is best',
    agreeLabel: 'Solo is better',
    mbti: 'E/I',
    scoring: { 'I': [6, 10], 'E': [1, 5] }
  },
  { 
    text: 'I am comfortable with change and new experiences.', 
    writeOnly: false,
    disagreeLabel: 'Prefer routine',
    agreeLabel: 'Embrace change',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'Describe a moment when you felt truly at peace. What made it special?', 
    writeOnly: true,
    mbti: 'E/I'
  },
  { 
    text: 'I often notice small details that others miss.', 
    writeOnly: false,
    disagreeLabel: 'Not really',
    agreeLabel: 'Always',
    mbti: 'N/S',
    scoring: { 'S': [6, 10], 'N': [1, 5] }
  },
  { 
    text: 'I prefer to plan my activities in advance.', 
    writeOnly: false,
    disagreeLabel: 'Spontaneous',
    agreeLabel: 'Planned',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I enjoy debating ideas and concepts.', 
    writeOnly: false,
    disagreeLabel: 'Avoid debates',
    agreeLabel: 'Love debating',
    mbti: 'T/F',
    scoring: { 'T': [6, 10], 'F': [1, 5] }
  },
  { 
    text: 'I am more practical than imaginative.', 
    writeOnly: false,
    disagreeLabel: 'Imaginative',
    agreeLabel: 'Practical',
    mbti: 'N/S',
    scoring: { 'S': [6, 10], 'N': [1, 5] }
  },
  { 
    text: 'I often think about how my actions affect others.', 
    writeOnly: false,
    disagreeLabel: 'Not often',
    agreeLabel: 'Always',
    mbti: 'T/F',
    scoring: { 'F': [6, 10], 'T': [1, 5] }
  },
  { 
    text: 'I prefer to keep my options open rather than making decisions early.', 
    writeOnly: false,
    disagreeLabel: 'Decide early',
    agreeLabel: 'Keep options open',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'I enjoy learning new skills and techniques.', 
    writeOnly: false,
    disagreeLabel: 'Not interested',
    agreeLabel: 'Love learning',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I often rely on my intuition when making decisions.', 
    writeOnly: false,
    disagreeLabel: 'Logic only',
    agreeLabel: 'Intuition guides me',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I prefer to have a small group of close friends rather than many acquaintances.', 
    writeOnly: false,
    disagreeLabel: 'Many acquaintances',
    agreeLabel: 'Few close friends',
    mbti: 'E/I',
    scoring: { 'I': [6, 10], 'E': [1, 5] }
  },
  { 
    text: 'What does a perfect day look like for you? Describe it in detail.', 
    writeOnly: true,
    mbti: 'N/S'
  },
  { 
    text: 'I enjoy organizing and planning events.', 
    writeOnly: false,
    disagreeLabel: 'Not my thing',
    agreeLabel: 'Love organizing',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I often think about the meaning behind events and experiences.', 
    writeOnly: false,
    disagreeLabel: 'Rarely',
    agreeLabel: 'Always',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I prefer to work in a structured environment with clear expectations.', 
    writeOnly: false,
    disagreeLabel: 'Flexible environment',
    agreeLabel: 'Structured environment',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I enjoy exploring new ideas and possibilities.', 
    writeOnly: false,
    disagreeLabel: 'Not interested',
    agreeLabel: 'Love exploring',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I often consider how others feel when making decisions.', 
    writeOnly: false,
    disagreeLabel: 'Logic first',
    agreeLabel: 'Feelings matter',
    mbti: 'T/F',
    scoring: { 'F': [6, 10], 'T': [1, 5] }
  },
  { 
    text: 'I prefer to have a detailed plan before starting a project.', 
    writeOnly: false,
    disagreeLabel: 'Wing it',
    agreeLabel: 'Plan it',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I enjoy being the center of attention.', 
    writeOnly: false,
    disagreeLabel: 'Avoid attention',
    agreeLabel: 'Love attention',
    mbti: 'E/I',
    scoring: { 'E': [6, 10], 'I': [1, 5] }
  },
  { 
    text: 'I often think about the big picture rather than the details.', 
    writeOnly: false,
    disagreeLabel: 'Details matter',
    agreeLabel: 'Big picture',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I prefer to work on multiple projects at once.', 
    writeOnly: false,
    disagreeLabel: 'One at a time',
    agreeLabel: 'Multitask',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'What motivates you to connect with others? Reflect on your deepest reasons.', 
    writeOnly: true,
    mbti: 'E/I'
  },
  { 
    text: 'I enjoy analyzing data and finding patterns.', 
    writeOnly: false,
    disagreeLabel: 'Not my strength',
    agreeLabel: 'Love analyzing',
    mbti: 'T/F',
    scoring: { 'T': [6, 10], 'F': [1, 5] }
  },
  { 
    text: 'I prefer to keep my workspace organized and tidy.', 
    writeOnly: false,
    disagreeLabel: 'Messy is fine',
    agreeLabel: 'Neat and tidy',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'I often think about how to improve my skills and knowledge.', 
    writeOnly: false,
    disagreeLabel: 'Accept as is',
    agreeLabel: 'Always improving',
    mbti: 'N/S',
    scoring: { 'S': [6, 10], 'N': [1, 5] }
  },
  { 
    text: 'I enjoy helping others solve their problems.', 
    writeOnly: false,
    disagreeLabel: 'Not my role',
    agreeLabel: 'Love helping',
    mbti: 'T/F',
    scoring: { 'F': [6, 10], 'T': [1, 5] }
  },
  { 
    text: 'I prefer to have a clear routine in my daily life.', 
    writeOnly: false,
    disagreeLabel: 'Variety is key',
    agreeLabel: 'Routine is best',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I often think about the implications of my actions.', 
    writeOnly: false,
    disagreeLabel: 'Live in the moment',
    agreeLabel: 'Consider implications',
    mbti: 'N/S',
    scoring: { 'S': [6, 10], 'N': [1, 5] }
  },
  { 
    text: 'I enjoy trying new foods and cuisines.', 
    writeOnly: false,
    disagreeLabel: 'Stick to familiar',
    agreeLabel: 'Love new foods',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I prefer to work in a quiet, distraction-free environment.', 
    writeOnly: false,
    disagreeLabel: 'Bustling is fine',
    agreeLabel: 'Quiet is best',
    mbti: 'E/I',
    scoring: { 'I': [6, 10], 'E': [1, 5] }
  },
  { 
    text: 'I often think about the meaning of life and existence.', 
    writeOnly: false,
    disagreeLabel: 'Not often',
    agreeLabel: 'Constantly',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'How do you approach making tough decisions? Describe your process.', 
    writeOnly: true,
    mbti: 'T/F'
  },
  { 
    text: 'I enjoy being spontaneous and going with the flow.', 
    writeOnly: false,
    disagreeLabel: 'Prefer plans',
    agreeLabel: 'Love spontaneity',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'I often think about how to improve my skills and knowledge.', 
    writeOnly: false,
    disagreeLabel: 'Content as is',
    agreeLabel: 'Always learning',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I prefer to have a clear goal before starting a task.', 
    writeOnly: false,
    disagreeLabel: 'Figure it out',
    agreeLabel: 'Need a goal',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'I enjoy discussing abstract ideas and theories.', 
    writeOnly: false,
    disagreeLabel: 'Not my thing',
    agreeLabel: 'Love abstract ideas',
    mbti: 'N/S',
    scoring: { 'N': [6, 10], 'S': [1, 5] }
  },
  { 
    text: 'I often think about how to make the world a better place.', 
    writeOnly: false,
    disagreeLabel: 'Not often',
    agreeLabel: 'Always',
    mbti: 'T/F',
    scoring: { 'F': [6, 10], 'T': [1, 5] }
  },
  { 
    text: 'I prefer to have a clear structure in my work and personal life.', 
    writeOnly: false,
    disagreeLabel: 'Flexible',
    agreeLabel: 'Structured',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I enjoy being around people who challenge my ideas.', 
    writeOnly: false,
    disagreeLabel: 'Prefer agreement',
    agreeLabel: 'Love challenges',
    mbti: 'T/F',
    scoring: { 'T': [6, 10], 'F': [1, 5] }
  },
  { 
    text: 'I often think about the consequences of my actions.', 
    writeOnly: false,
    disagreeLabel: 'Live in the moment',
    agreeLabel: 'Consider consequences',
    mbti: 'N/S',
    scoring: { 'S': [6, 10], 'N': [1, 5] }
  },
  { 
    text: 'I prefer to have a clear plan for the future.', 
    writeOnly: false,
    disagreeLabel: 'Take it as it comes',
    agreeLabel: 'Plan ahead',
    mbti: 'J/P',
    scoring: { 'P': [6, 10], 'J': [1, 5] }
  },
  { 
    text: 'What does success mean to you? Reflect on your definition and how it shapes your life.', 
    writeOnly: true,
    mbti: 'N/S'
  },
  { 
    text: 'I prefer to rely on proven methods rather than experimenting with new ideas.', 
    writeOnly: false,
    disagreeLabel: 'Experiment',
    agreeLabel: 'Proven methods',
    mbti: 'N/S',
    scoring: { 'S': [6, 10], 'N': [1, 5] }
  },
  { 
    text: 'I often prioritize harmony in my relationships over being right.', 
    writeOnly: false,
    disagreeLabel: 'Being right',
    agreeLabel: 'Harmony first',
    mbti: 'T/F',
    scoring: { 'F': [6, 10], 'T': [1, 5] }
  },
  { 
    text: 'I feel more comfortable when I have a clear deadline for my tasks.', 
    writeOnly: false,
    disagreeLabel: 'No deadlines',
    agreeLabel: 'Need deadlines',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I prefer to finish one task completely before starting another.', 
    writeOnly: false,
    disagreeLabel: 'Multitask',
    agreeLabel: 'Finish one task',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'I like to know exactly what’s expected of me in any situation.', 
    writeOnly: false,
    disagreeLabel: 'Figure it out',
    agreeLabel: 'Need clarity',
    mbti: 'J/P',
    scoring: { 'J': [6, 10], 'P': [1, 5] }
  },
  { 
    text: 'How do you handle conflicts with others? Describe your approach.', 
    writeOnly: true,
    mbti: 'T/F'
  },
  { 
    text: 'How do you feel about unexpected changes in your plans? Reflect on a recent experience.', 
    writeOnly: true,
    mbti: 'J/P'
  },
  { 
    text: 'Describe your approach to managing your daily tasks and responsibilities.', 
    writeOnly: true,
    mbti: 'J/P'
  }
];

export default questions;