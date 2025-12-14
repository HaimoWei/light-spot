export type Locale = "en" | "zh";

export type LocalizedText = {
  en: string;
  zh: string;
};

export type DemoAccessCredential = {
  role: LocalizedText;
  accessUrl?: string;
  identifierKind: "email" | "username";
  identifier: string;
  password: string;
};

export type ProjectDemoAccess = {
  credentials: DemoAccessCredential[];
  note?: LocalizedText;
};

export type Project = {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  image: string;
  technologies: string[];
  highlights: string[];
  highlightsZh: string[];
  demoUrl: string;
  githubUrl: string;
  contribution: number;
  role: string;
  roleZh: string;
  collaboration: "personal" | "team";
  demoAccess?: ProjectDemoAccess;
};

export type SkillCategory = "backend" | "frontend" | "dataDevops" | "tools";

export type Skill = {
  name: string;
  iconClass?: string;
  category: SkillCategory;
};
