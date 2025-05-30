import { Link, Outlet } from 'react-router-dom'
import { getAllIdeasRoute, getNewIdeaRoute } from '../../lib/routes'
import cl from './index.module.scss'

export const Layout = () => {
  return (
    <div className={cl.layout}>
      <div className={cl.navigation}>
        <div className={cl.logo}>MakeIdea</div>
        <ul className={cl.menu}>
          <li className={cl.item}>
            <Link to={getAllIdeasRoute()} className={cl.link}>
              All Ideas
            </Link>
          </li>
          <li className={cl.item}>
            <Link to={getNewIdeaRoute()} className={cl.link}>
              Add Idea
            </Link>
          </li>
        </ul>
      </div>
      <div className={cl.content}>
        <Outlet />
      </div>
    </div>
  )
}
