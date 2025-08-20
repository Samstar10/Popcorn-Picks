// src/test/test-utils.tsx
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React, { PropsWithChildren } from 'react'

function createTestClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

type AllProvidersProps = PropsWithChildren<{
  session?: Parameters<typeof SessionProvider>[0]['session'] // if undefined, we won't mount SessionProvider
}>

function AllProviders({ children, session }: AllProvidersProps) {
  const qc = createTestClient()
  const tree = <QueryClientProvider client={qc}>{children}</QueryClientProvider>

  // Only mount SessionProvider if a session is supplied.
  if (session === undefined) return tree

  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      {tree}
    </SessionProvider>
  )
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { session?: AllProvidersProps['session'] }
) {
  const { session, ...rest } = options ?? {}
  return render(ui, { wrapper: (p) => <AllProviders session={session} {...p} />, ...rest })
}

export * from '@testing-library/react'
