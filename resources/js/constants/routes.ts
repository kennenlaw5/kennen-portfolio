import {lazy} from 'react'

const Contact = lazy(() => import('JS/pages/contact/Contact'))
const Experience = lazy(() => import('JS/pages/Experience'))
const Games = lazy(() => import('JS/pages/Games'))
const Home = lazy(() => import('JS/pages/home/Home'))
const Projects = lazy(() => import('JS/pages/Projects'))
const Skills = lazy(() => import('JS/pages/Skills'))

type TRoute = {
  path: string
  name: string
  component: React.LazyExoticComponent<React.FC>
}
type TRoutes = {
  [key: string]: TRoute
}

export const HOME_ROUTE: TRoute = {
  path: '/',
  name: 'Home',
  component: Home
}

export const ROUTES: TRoutes = {
    GAMES: {
      path: 'games',
      name: 'Games',
      component: Games
    },
    PROJECTS: {
      path: 'projects',
      name: 'Projects',
      component: Projects
    },
    // SKILLS: {
    //   path: 'skills',
    //   name: 'Skills',
    //   component: Skills
    // },
    // EXPERIENCE: {
    //   path: 'experience',
    //   name: 'Experience',
    //   component: Experience
    // },
    CONTACT: {
      path: 'contact',
      name: 'Contact',
      component: Contact
    },
  };
  