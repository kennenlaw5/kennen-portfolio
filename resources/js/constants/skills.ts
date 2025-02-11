import {TSkill} from 'Components/types/SkillTypes'

export const SKILL_TYPES = {
    ALL: 'all',
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
    GIT: {
        name: 'Git',
        type: SKILL_TYPES.BACKEND
    },
    AWS_ECOSYSTEM: {
        name: 'AWS Ecosystem',
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
    COMPOSER: {
        name: 'Composer',
        type: SKILL_TYPES.BACKEND
    },
    DOCKER: {
        name: 'Docker',
        type: SKILL_TYPES.BACKEND
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
  }