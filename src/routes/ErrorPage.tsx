import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError()
  console.log(error)
  return (
    // @ts-expect-error error is unkown status
    <h1>Error {error?.status}: {error?.statusText ?? error?.message ?? "Unkown"}</h1>
  )
}
