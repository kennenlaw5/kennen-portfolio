import {TSkill} from 'Components/types/SkillTypes'

export const SKILL_TYPES = {
    ALL: 'all',
    AI: 'ai',
    BACKEND: 'backend',
    CLOUD: 'cloud',
    FRONTEND: 'frontend',
}

type TSkills = {
    [key: string]: TSkill
}

export const SKILLS: TSkills = {
    PHP: {
        name: 'PHP',
        type: SKILL_TYPES.BACKEND
    },
    LARAVEL: {
        name: 'Laravel',
        type: SKILL_TYPES.BACKEND
    },
    JAVASCRIPT: {
        name: 'JavaScript',
        type: SKILL_TYPES.FRONTEND
    },
    TYPESCRIPT: {
        name: 'TypeScript',
        type: SKILL_TYPES.FRONTEND
    },
    REACT: {
        name: 'React',
        type: SKILL_TYPES.FRONTEND
    },
    NEXTJS: {
        name: 'Next.js',
        type: SKILL_TYPES.FRONTEND
    },
    REDUX: {
        name: 'Redux',
        type: SKILL_TYPES.FRONTEND
    },
    GATSBY: {
        name: 'Gatsby',
        type: SKILL_TYPES.FRONTEND
    },
    AXIOS: {
        name: 'Axios',
        type: SKILL_TYPES.FRONTEND
    },
    JQUERY: {
        name: 'JQuery',
        type: SKILL_TYPES.FRONTEND
    },
    SQL: {
        name: 'SQL',
        type: SKILL_TYPES.BACKEND
    },
    POSTGRESQL: {
        name: 'PostgreSQL',
        type: SKILL_TYPES.BACKEND
    },
    MYSQL: {
        name: 'MySQL',
        type: SKILL_TYPES.BACKEND
    },
    GRAPHQL: {
        name: 'GraphQL',
        type: SKILL_TYPES.BACKEND
    },
    REST_APIS: {
        name: 'REST APIs',
        type: SKILL_TYPES.BACKEND
    },
    FHIR_R4: {
        name: 'FHIR R4',
        type: SKILL_TYPES.BACKEND
    },
    KAFKA: {
        name: 'Kafka',
        type: SKILL_TYPES.BACKEND
    },
    GIT: {
        name: 'Git',
        type: SKILL_TYPES.BACKEND
    },
    AWS: {
        name: 'AWS',
        type: SKILL_TYPES.CLOUD
    },
    JIRA: {
        name: 'Jira',
        type: SKILL_TYPES.CLOUD
    },
    BITBUCKET: {
        name: 'Bitbucket',
        type: SKILL_TYPES.CLOUD
    },
    GITHUB: {
        name: 'GitHub',
        type: SKILL_TYPES.CLOUD
    },
    HTML: {
        name: 'HTML',
        type: SKILL_TYPES.FRONTEND
    },
    CSS_SCSS: {
        name: 'CSS/SCSS',
        type: SKILL_TYPES.FRONTEND
    },
    MICROSERVICES: {
        name: 'Microservices',
        type: SKILL_TYPES.BACKEND
    },
    NODEJS: {
        name: 'Node.js',
        type: SKILL_TYPES.BACKEND
    },
    NESTJS: {
        name: 'NestJS',
        type: SKILL_TYPES.BACKEND
    },
    COMPOSER: {
        name: 'Composer',
        type: SKILL_TYPES.BACKEND
    },
    DOCKER: {
        name: 'Docker',
        type: SKILL_TYPES.BACKEND
    },
    CI_CD: {
        name: 'CI/CD',
        type: SKILL_TYPES.CLOUD
    },
    GITHUB_ACTIONS: {
        name: 'GitHub Actions',
        type: SKILL_TYPES.CLOUD
    },
    VALET: {
        name: 'Valet',
        type: SKILL_TYPES.BACKEND
    },
    JAVA: {
        name: 'Java',
        type: SKILL_TYPES.BACKEND
    },
    C_PLUS_PLUS: {
        name: 'C++',
        type: SKILL_TYPES.BACKEND
    },
    PYTHON: {
        name: 'Python',
        type: SKILL_TYPES.BACKEND
    },
    WEBPACK: {
        name: 'Webpack',
        type: SKILL_TYPES.FRONTEND
    },
    POSTCSS: {
        name: 'PostCSS',
        type: SKILL_TYPES.FRONTEND
    },
    YARN: {
        name: 'Yarn',
        type: SKILL_TYPES.FRONTEND
    },
    NPM: {
        name: 'Npm',
        type: SKILL_TYPES.FRONTEND
    },
    RENDER: {
        name: 'Render',
        type: SKILL_TYPES.CLOUD
    },
    JEST: {
        name: 'Jest',
        type: SKILL_TYPES.FRONTEND
    },
    PHPUNIT: {
        name: 'PHPUnit',
        type: SKILL_TYPES.BACKEND
    },
    PROMPTING: {
        name: 'Prompting',
        type: SKILL_TYPES.AI
    },
    AGENTIC_WORKFLOWS: {
        name: 'Agentic Workflows',
        type: SKILL_TYPES.AI
    },
    REUSABLE_SKILLS: {
        name: 'Reusable Skills',
        type: SKILL_TYPES.AI
    },
    VALIDATION_LOOPS: {
        name: 'Validation Loops',
        type: SKILL_TYPES.AI
    },
    CONTEXT_CONTROL: {
        name: 'Context Control',
        type: SKILL_TYPES.AI
    },
    TOKEN_EFFICIENCY: {
        name: 'Token Efficiency',
        type: SKILL_TYPES.AI
    },
    MCP: {
        name: 'MCP',
        type: SKILL_TYPES.AI
    },
    CODEX: {
        name: 'Codex',
        type: SKILL_TYPES.AI
    },
    CLAUDE_CODE: {
        name: 'Claude Code CLI',
        type: SKILL_TYPES.AI
    },
    AMAZON_BEDROCK: {
        name: 'Amazon Bedrock',
        type: SKILL_TYPES.AI
    },
    GITHUB_COPILOT: {
        name: 'GitHub Copilot',
        type: SKILL_TYPES.AI
    },
    GREPTILE: {
        name: 'Greptile',
        type: SKILL_TYPES.AI
    },
  }
