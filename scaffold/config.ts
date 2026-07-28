export const scaffoldConfig = {
  home: { organization: 3, research: 3, video: 1 },
  organization: { directors: 3, council: 3, teacherLeaders: 3, studentLeaders: 6 },
  research: { directions: 3, metrics: 4 },
  cooperation: { types: 3, international: 1, partners: 8 },
  students: { labs: 2, timeline: 5 },
  contact: { cards: 3 },
} as const;
