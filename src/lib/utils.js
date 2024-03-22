export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}

export function extractQueryParams(query) {
  return query
    .substr(1)
    .split('&')
    .reduce((acc, param) => {
      const [key, value] = param.split('=')
      acc[key] = value

      return acc
    }, {})
}