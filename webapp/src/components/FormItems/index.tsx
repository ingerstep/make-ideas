import cl from './index.module.scss'

export const FormItems = ({ children }: { children: React.ReactNode }) => {
  return <div className={cl.formItems}>{children}</div>
}
