import type { Skill } from "@/types";

export const skills: Skill[] = [
  { name: "Java", iconClass: "devicon-java-plain", category: "backend" },
  { name: "Spring Boot", iconClass: "devicon-spring-plain", category: "backend" },
  { name: "Spring Cloud", iconClass: "devicon-spring-plain", category: "backend" },
  { name: "Python", iconClass: "devicon-python-plain", category: "backend" },
  { name: "Django", iconClass: "devicon-django-plain", category: "backend" },
  { name: "Node.js", iconClass: "devicon-nodejs-plain", category: "backend" },

  { name: "TypeScript", iconClass: "devicon-typescript-plain", category: "frontend" },
  { name: "React", iconClass: "devicon-react-original", category: "frontend" },
  { name: "Next.js", iconClass: "devicon-nextjs-plain", category: "frontend" },
  { name: "Tailwind CSS", iconClass: "devicon-tailwindcss-plain", category: "frontend" },

  { name: "PostgreSQL", iconClass: "devicon-postgresql-plain", category: "dataDevops" },
  { name: "Redis", iconClass: "devicon-redis-plain", category: "dataDevops" },
  { name: "Docker", iconClass: "devicon-docker-plain", category: "dataDevops" },
  { name: "AWS", iconClass: "devicon-amazonwebservices-original", category: "dataDevops" },
  { name: "Nginx", iconClass: "devicon-nginx-original", category: "dataDevops" },

  { name: "Git", iconClass: "devicon-git-plain", category: "tools" },
  { name: "GitHub Actions", iconClass: "devicon-github-original", category: "tools" },
  { name: "Jira", iconClass: "devicon-jira-plain", category: "tools" }
];

