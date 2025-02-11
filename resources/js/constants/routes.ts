import {lazy} from 'react'

const Contact = lazy(() => import('JS/pages/contact/Contact'))
const Games = lazy(() => import('JS/pages/Games'))
const Home = lazy(() => import('JS/pages/home/Home'))
const Experience = lazy(() => import('JS/pages/experience/Experience'))

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
      component: Games,
    },
    EXPERIENCE: {
      path: 'experience',
      name: 'Experience',
      component: Experience,
    },
    CONTACT: {
      path: 'contact',
      name: 'Contact',
      component: Contact,
    },
  };
  