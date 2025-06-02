import { Link, Outlet } from 'react-router-dom'
import { getAllIdeasRoute, getNewIdeaRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import cl from './index.module.scss'

export const Layout = () => {
  const { data, isLoading, isError, isFetching } = trpc.getMe.useQuery()
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
          {isLoading || isError || isFetching ? null : data.me ? (
            <>
              <li className={cl.item}>
                <Link to={getNewIdeaRoute()} className={cl.link}>
                  Add Idea
                </Link>
              </li>
              <li className={cl.item}>
                <Link to={getSignOutRoute()} className={cl.link}>
                  Logout ({data.me.nick})
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
