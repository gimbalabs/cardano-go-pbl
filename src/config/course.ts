export const COURSE = {
  title: "Cardano Go PBL",
  description: "Learn to build on Cardano using Go. Ten modules from Go fundamentals to advanced chain indexing and node communication, with on-chain credentials.",
  moduleCount: 10,
  routes: {
    learn: "/learn",
    home: "/",
    module: (moduleCode: string) => `/learn/${moduleCode}`,
    lesson: (moduleCode: string, lessonIndex: number) => `/learn/${moduleCode}/${lessonIndex}`,
    assignment: (moduleCode: string) => `/learn/${moduleCode}/assignment`,
    dashboard: "/dashboard",
  },
} as const;
