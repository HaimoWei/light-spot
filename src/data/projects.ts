import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "koalaswap",
    title: "KoalaSwap",
    titleZh: "KoalaSwap",
    description:
      "A production-ready second-hand marketplace with microservices, real-time buyer–seller chat, and AWS S3/CloudFront integration.",
    descriptionZh: "生产级二手交易平台：微服务架构、买卖双方实时聊天，并集成 AWS S3/CloudFront。",
    image: "/images/projects/koalaswap.png",
    technologies: ["Java 21", "Spring Boot", "React", "PostgreSQL", "Redis", "AWS", "Docker"],
    highlights: [
      "7 microservices with Spring Cloud Gateway",
      "WebSocket (STOMP) real-time chat + Redis Pub/Sub",
      "JWT token versioning for instant invalidation (<100ms)",
      "799+ real products imported via ETL pipeline"
    ],
    highlightsZh: ["7个微服务 + 网关", "WebSocket 实时聊天 + Redis Pub/Sub", "JWT Token 版本号：<100ms 全局失效", "ETL 导入 799+ 真实商品数据"],
    demoUrl: "https://koalaswap.lightspot.uk",
    githubUrl: "https://github.com/HaimoWei/koalaswap",
    contribution: 100,
    role: "Full Stack Developer & DevOps",
    roleZh: "全栈开发 & 运维",
    collaboration: "personal",
    demoAccess: {
      credentials: [
        {
          role: { en: "Test Account", zh: "测试账号" },
          accessUrl: "https://koalaswap.lightspot.uk",
          identifierKind: "email",
          identifier: "weihaimoau@gmail.com",
          password: "weihaimo"
        }
      ]
    }
  },
  {
    id: "shopthelook",
    title: "ShopTheLook / StyleShare",
    titleZh: "ShopTheLook / StyleShare",
    description:
      "A social commerce platform (Instagram meets e-commerce) built with microservices and 85%+ backend test coverage.",
    descriptionZh: "社交电商平台（类 Instagram + 电商）：微服务架构，并保持 85%+ 后端测试覆盖率。",
    image: "/images/projects/shopthelook.png",
    technologies: ["Java 21", "Spring Boot", "Next.js", "PostgreSQL", "Redis", "Docker", "GCP"],
    highlights: [
      "8 services + API Gateway, clear service boundaries",
      "3-tier RBAC (ROOT → Seller → User) with admin impersonation",
      "Redis-backed JWT revocation (<100ms) across services",
      "85%+ coverage enforced by JaCoCo"
    ],
    highlightsZh: ["8个服务 + API Gateway", "三层权限（ROOT→Seller→User）+ 管理员模拟", "Redis Token 黑名单：<100ms 失效传播", "JaCoCo 强制 85%+ 覆盖率"],
    demoUrl: "https://styleshare.lightspot.uk",
    githubUrl: "https://github.com/HaimoWei/style-share",
    contribution: 70,
    role: "Full Stack Developer / Team Leader",
    roleZh: "全栈开发 / 团队负责人",
    collaboration: "team",
    demoAccess: {
      credentials: [
        {
          role: { en: "User", zh: "用户" },
          accessUrl: "https://styleshare.lightspot.uk",
          identifierKind: "email",
          identifier: "weihaimoau@gmail.com",
          password: "weihaimo"
        },
        {
          role: { en: "Seller", zh: "商家" },
          accessUrl: "https://styleshare.lightspot.uk/admin",
          identifierKind: "username",
          identifier: "Nike",
          password: "weihaimo"
        },
        {
          role: { en: "ROOT Admin", zh: "ROOT 管理员" },
          accessUrl: "https://styleshare.lightspot.uk/admin",
          identifierKind: "username",
          identifier: "styleshare",
          password: "styleshare"
        }
      ]
    }
  },
  {
    id: "aimenusystem",
    title: "AI Menu System",
    titleZh: "AI 点餐系统",
    description:
      "An AI-assisted restaurant ordering platform with dual portals, multi-language voice/text interaction, and real-time sync.",
    descriptionZh: "AI 餐厅点餐平台：双端（顾客/管理）架构，多语言语音/文字交互，并支持实时同步。",
    image: "/images/projects/aimenusystem.png",
    technologies: ["Python", "Django", "Next.js", "PostgreSQL", "Redis", "OpenAI", "WebSocket"],
    highlights: [
      "LangChain + LangGraph agent with custom tools",
      "Redis-cached context for natural multi-turn dialogue",
      "WebSocket + Redis Pub/Sub for multi-device sync",
      "Feature-flag driven API for graceful degradation"
    ],
    highlightsZh: ["LangChain + LangGraph 智能体 + 自定义工具", "Redis 缓存上下文，多轮对话更自然", "WebSocket + Redis Pub/Sub 多设备实时同步", "Feature Flag：服务不可用时优雅降级"],
    demoUrl: "https://aimenusystem.lightspot.uk",
    githubUrl: "https://github.com/HaimoWei/ai-menu-system",
    contribution: 60,
    role: "Full Stack Developer / Team Leader",
    roleZh: "全栈开发 / 团队负责人",
    collaboration: "team"
  },
  {
    id: "cyberlight",
    title: "CyberLight",
    titleZh: "CyberLight",
    description:
      "A teaching-focused cyber range built on CTFd with classroom workflows, reporting, and 200+ curated challenges.",
    descriptionZh: "基于 CTFd 的教学型网络靶场：课堂流程、教学报表与 200+ 精选题库。",
    image: "/images/projects/cyberlight.png",
    technologies: ["CTFd", "Flask", "MariaDB", "Redis", "Docker", "FRP", "Nginx"],
    highlights: [
      "Classroom & reporting plugins (no core fork)",
      "Per-student isolated dynamic containers via Whale + FRP",
      "200+ real-world challenges across categories",
      "Production use for university cybersecurity teaching"
    ],
    highlightsZh: ["课堂/报表插件扩展（不改 CTFd 核心）", "Whale + FRP：每位学生独立动态容器", "200+ 真实题库，覆盖多类别", "高校网络安全课程生产使用"],
    demoUrl: "https://ctf.lightspot.uk",
    githubUrl: "https://github.com/HaimoWei/cyber-light-overview",
    contribution: 50,
    role: "Co-Developer",
    roleZh: "联合开发者",
    collaboration: "team",
    demoAccess: {
      credentials: [
        {
          role: { en: "User", zh: "用户" },
          accessUrl: "https://ctf.lightspot.uk",
          identifierKind: "username",
          identifier: "haimowei",
          password: "weihaimo"
        }
      ],
      note: {
        en: "Admin access is available during interviews if needed.",
        zh: "如需管理员功能演示，可在面试时提供。"
      }
    }
  }
];
