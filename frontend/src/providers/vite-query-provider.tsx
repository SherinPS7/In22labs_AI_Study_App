import React from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

type Props = {
    children : React.ReactNode;
}

const ViteQueryProvider = (props : Props) => {
    const queryclient = new QueryClient();
  return (
    <QueryClientProvider client={queryclient}>
        {props.children}
    </QueryClientProvider>
  )
}

export default ViteQueryProvider