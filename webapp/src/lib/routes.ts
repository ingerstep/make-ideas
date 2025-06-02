const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getAllIdeasRoute = () => '/'

export const viewIdeaRouteParams = getRouteParams({ makeIdea: true })
export type ViewIdeaRouteParams = typeof viewIdeaRouteParams
export const getViewIdeaRoute = ({ makeIdea }: ViewIdeaRouteParams) => `/ideas/${makeIdea}`
export const getEditIdeaRoute = ({ makeIdea }: ViewIdeaRouteParams) => `/ideas/${makeIdea}/edit`

export const getNewIdeaRoute = () => '/ideas/new'
export const getSignUpRoute = () => '/sign-up'
export const getSignInRoute = () => '/sign-in'
export const getSignOutRoute = () => '/sign-out'
