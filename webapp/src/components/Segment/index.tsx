import type { ReactNode } from 'react'
import cl from './index.module.scss'

type SegmentProps = {
  title: ReactNode
  size?: 1 | 2
  description?: string
  children?: ReactNode
}

export const Segment = ({ title, size = 1, description, children }: SegmentProps) => {
  return (
    <div className={cl.segment}>
      {size === 1 ? <h1 className={cl.title}>{title}</h1> : <h2 className={cl.title}>{title}</h2>}
      {description && <p className={cl.description}>{description}</p>}
      {children && <div className={cl.content}>{children}</div>}
    </div>
  )
}
