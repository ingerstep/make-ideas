import cn from 'classnames'
import cl from './index.module.scss'

export const Loader = ({ type }: { type: 'page' | 'section' }) => {
  return <span className={cn({ [cl.loader]: true, [cl[`type-${type}`]]: true })} />
}
