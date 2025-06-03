import { Link, Outlet } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { getAllIdeasRoute, getNewIdeaRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from '../../lib/routes'
import cl from './index.module.scss'

export const Layout = () => {
  const me = useMe()

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
          {me ? (
            <>
              <li className={cl.item}>
                <Link to={getNewIdeaRoute()} className={cl.link}>
                  Add Idea
                </Link>
              </li>
              <li className={cl.item}>
                <Link to={getSignOutRoute()} className={cl.link}>
                  Logout ({me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={cl.item}>
                <Link to={getSignUpRoute()} className={cl.link}>
                  Sign up
                </Link>
              </li>
              <li className={cl.item}>
                <Link to={getSignInRoute()} className={cl.link}>
                  Sign in
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={cl.content}>
        <Outlet />
      </div>
    </div>
  )
}
