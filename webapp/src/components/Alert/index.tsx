import cn from 'classnames'
import cl from './index.module.scss'

export type AlertProps = {
  color: 'red' | 'green' | 'brown'
  hidden?: boolean
  children: React.ReactNode
}
export const Alert = ({ color, children, hidden }: AlertProps) => {
  if (hidden) {
    return null
  }

  return <div className={cn({ [cl.alert]: true, [cl[color]]: true })}>{children}</div>
}
