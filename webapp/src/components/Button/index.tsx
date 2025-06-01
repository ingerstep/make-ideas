import cn from 'classnames'
import cl from './index.module.scss'

export const Button = ({ children, loading = false }: { children: React.ReactNode; loading?: boolean }) => {
  return (
    <button className={cn({ [cl.button]: true, [cl.loading]: loading })} type="submit" disabled={loading}>
      {loading ? 'Submitting...' : children}
    </button>
  )
}
