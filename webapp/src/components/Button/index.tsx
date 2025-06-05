import cn from 'classnames'
import { Link } from 'react-router-dom'
import cl from './index.module.scss'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  color?: ButtonColor
}
type ButtonColor = 'red' | 'green'

export const Button = ({ children, loading = false, color = 'green' }: ButtonProps) => {
  return (
    <button
      className={cn({ [cl.button]: true, [cl[`color-${color}`]]: true, [cl.loading]: loading, [cl.disabled]: loading })}
      type="submit"
      disabled={loading}
    >
      <span className={cl.text}>{children}</span>
    </button>
  )
}

export const LinkButton = ({
  children,
  to,
  color = 'green',
}: {
  children: React.ReactNode
  to: string
  color?: ButtonColor
}) => {
  return (
    <Link className={cn({ [cl.button]: true, [cl[`color-${color}`]]: true })} to={to}>
      {children}
    </Link>
  )
}
