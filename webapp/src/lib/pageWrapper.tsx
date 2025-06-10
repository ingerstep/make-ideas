import { useStore } from '@nanostores/react'
import type { UseTRPCQueryResult, UseTRPCQuerySuccessResult } from '@trpc/react-query/shared'
import { useEffect, type FC } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { ErrorPageComponent } from '../components/ErrorPageComponent'
import { Loader } from '../components/Loader'
import { lastVisitedNotAuthRoutesStore } from '../components/NonAuthRouteTracker'
import { NotFoundPage } from '../pages/other/NotFoundPage'
import { useAppContext, type AppContext } from './ctx'

class CheckExistsError extends Error {}
const checkExistsFn = <T,>(value: T, message?: string): NonNullable<T> => {
  if (!value) {
    throw new CheckExistsError(message)
  }
  return value
}

class checkAccessError extends Error {}
const checkAccessFn = <T,>(value: T, message?: string): void => {
  if (!value) {
    throw new checkAccessError(message)
  }
}

class GetAuthorizedMeError extends Error {}

type Props = Record<string, any>
type QueryResult = UseTRPCQueryResult<any, any>
type QuerySuccessResult<TQueryResult extends QueryResult> = UseTRPCQuerySuccessResult<
  NonNullable<TQueryResult['data']>,
  null
>
type HelperProps<TQueryResult extends QueryResult | undefined> = {
  ctx: AppContext
  queryResult: TQueryResult extends QueryResult ? QuerySuccessResult<TQueryResult> : undefined
}

type setPropsProps<TQueryResult extends QueryResult | undefined> = HelperProps<TQueryResult> & {
  checkExists: typeof checkExistsFn
  checkAccess: typeof checkAccessFn
  getAuthorizedMe: (message?: string) => NonNullable<AppContext['me']>
}

type PageWrapperProps<TProps extends Props, TQueryResult extends QueryResult | undefined> = {
  redirectAuthorized?: boolean

  authorizedOnly?: boolean
  authorizedOnlyTitle?: string
  authorizedOnlyMessage?: string

  checkAccess?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkAccessTitle?: string
  checkAccessMessage?: string

  checkExists?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkExistsTitle?: string
  checkExistsMessage?: string

  showLoaderOnFetching?: boolean

  title: string | ((titleProps: HelperProps<TQueryResult> & TProps) => string)
  isTitleExact?: boolean

  useQuery?: () => TQueryResult
  setProps?: (setPropsProps: setPropsProps<TQueryResult>) => TProps
  Page: FC<TProps>
}

const PageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>({
  authorizedOnly,
  authorizedOnlyTitle = 'Please, Authorize',
  authorizedOnlyMessage = 'This page is available only for authorized users',
  redirectAuthorized,
  checkAccess,
  checkAccessTitle = 'Access Denied',
  checkAccessMessage = 'You do not have access to this page',
  checkExists,
  checkExistsMessage,
  checkExistsTitle,
  useQuery,
  setProps,
  isTitleExact = false,
  title,
  Page,
  showLoaderOnFetching = true,
}: PageWrapperProps<TProps, TQueryResult>) => {
  const lastVisitedNotAuthRoute = useStore(lastVisitedNotAuthRoutesStore)
  const navigate = useNavigate()
  const ctx = useAppContext()
  const queryResult = useQuery?.()

  const redirectedNeeded = redirectAuthorized && ctx.me

  useEffect(() => {
    if (redirectedNeeded) {
      navigate(lastVisitedNotAuthRoute, { replace: true })
    }
  }, [redirectedNeeded, navigate, lastVisitedNotAuthRoute])

  if (queryResult?.isLoading || (showLoaderOnFetching && queryResult?.isFetching) || redirectedNeeded) {
    return <Loader type="page" />
  }

  if (queryResult?.isError) {
    return <ErrorPageComponent message={queryResult?.error.message} />
  }

  if (authorizedOnly && !ctx.me) {
    return <ErrorPageComponent title={authorizedOnlyTitle} message={authorizedOnlyMessage} />
  }

  const helperProps = {
    ctx,
    queryResult: queryResult as never,
  }

  if (checkAccess) {
    const accessDenied = !checkAccess(helperProps)
    if (accessDenied) {
      return <NotFoundPage title={checkAccessTitle} message={checkAccessMessage} />
    }
  }

  if (checkExists) {
    const notExists = !checkExists(helperProps)
    if (notExists) {
      return <NotFoundPage title={checkExistsTitle} message={checkExistsMessage} />
    }
  }

  const getAuthorizedMe = (message?: string) => {
    if (!ctx.me) {
      throw new GetAuthorizedMeError(message)
    }
    return ctx.me
  }

  try {
    const props = setProps?.({
      ...helperProps,
      checkExists: checkExistsFn,
      checkAccess: checkAccessFn,
      getAuthorizedMe,
    }) as TProps
    const calculatedTitle = typeof title === 'function' ? title({ ...helperProps, ...props }) : title
    const exactTitle = isTitleExact ? calculatedTitle : `${calculatedTitle} - Make Ideas`
    return (
      <>
        <Helmet>
          <title>{exactTitle}</title>
        </Helmet>
        <Page {...props} />
      </>
    )
  } catch (error) {
    if (error instanceof CheckExistsError) {
      return <ErrorPageComponent title={checkExistsTitle} message={error.message || checkExistsMessage} />
    }
    if (error instanceof checkAccessError) {
      return <ErrorPageComponent title={checkAccessTitle} message={error.message || checkAccessMessage} />
    }
    if (error instanceof GetAuthorizedMeError) {
      return <ErrorPageComponent title={authorizedOnlyTitle} message={error.message || authorizedOnlyMessage} />
    }
    throw error
  }
}

export const withPageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>(
  pageWrapperProps: Omit<PageWrapperProps<TProps, TQueryResult>, 'Page'>
) => {
  return (Page: PageWrapperProps<TProps, TQueryResult>['Page']) => {
    const WrappedComponent = () => <PageWrapper Page={Page} {...pageWrapperProps} />
    WrappedComponent.displayName = `withPageWrapper(${Page.displayName || Page.name || 'Anonymous'})`
    return WrappedComponent
  }
}
