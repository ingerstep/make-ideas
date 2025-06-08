import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import type { IconBaseProps } from 'react-icons/lib'

const icons = {
  lokeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
}

export const Icon = ({ name, ...rest }: { name: keyof typeof icons } & IconBaseProps) => {
  const Icon = icons[name]
  return <Icon {...rest} />
}
