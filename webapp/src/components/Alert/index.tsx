import cn from 'classnames'
import cl from './index.module.scss'
export const Alert = ({ color, children }: { color: 'red' | 'green'; children: React.ReactNode }) => {
  return <div className={cn({ [cl.alert]: true, [cl[color]]: true })}>{children}</div>
}
