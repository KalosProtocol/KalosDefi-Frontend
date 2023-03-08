import { StaticJsonRpcProvider } from '@ethersproject/providers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()

console.log(RPC_URL)

// export const simpleRpcProvider = new StaticJsonRpcProvider('https://data-seed-prebsc-2-s3.binance.org:8545')

export const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL)

export default null
