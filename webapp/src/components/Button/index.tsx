import cn from 'classnames'
import { Link } from 'react-router-dom'
import cl from './index.module.scss'

export const Button = ({ children, loading = false }: { children: React.ReactNode; loading?: boolean }) => {
  return (
    <button className={cn({ [cl.button]: true, [cl.loading]: loading })} type="submit" disabled={loading}>
      {loading ? 'Submitting...' : children}
    </button>
  )
}

export const LinkButton = ({ children, to }: { children: React.ReactNode; to: string }) => {
  return (
    <Link className={cn({ [cl.button]: true })} to={to}>
      {children}
    </Link>
  )
}
