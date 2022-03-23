import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import { useWeb3React } from '@web3-react/core'
import { Heading } from '@fastswap-uikit'

import { QuoteToken } from 'config/constants/types'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd, usePriceEthBusd, usePriceDukeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account } = useWeb3React()
  const ethPriceUsd = usePriceEthBusd()
  // const fastPriceUsd = usePriceFastBusd()
  const dukePriceBusd = usePriceDukeBusd()

  const TranslateString = useI18n()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stackedOnly, setStackedOnly] = useState(false)
  const [specialOnly, setSpecialOnly] = useState('all')

  const activeFarms = farmsLP.filter((farm) => farm.pid !== -1 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== -1 && farm.multiplier === '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  const dukeOnlyFarms = activeFarms.filter((farm) => farm.isSpecial === 'duke' || farm.isSpecial === 'both')
  const fastOnlyFarms = activeFarms.filter((farm) => farm.isSpecial === 'new' || farm.isSpecial === 'new')
  const oldFarms = activeFarms.filter((farm) => farm.isSpecial === 'no')

  // /! This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const cakeRewardPerYear = new BigNumber(farm.amountFastTokens).div(91).times(365)

        let apy;
        if (farm.quoteTokenSymbol === 'DUKE') {
        
          // In case of DUKE, Decimal is 9
          apy = dukePriceBusd
          .times(cakeRewardPerYear)
          .div(new BigNumber(farm.totalLiquidityWithoutPrice).times(cakePrice)).times(new BigNumber(10).pow(8))
        }
        else {
        
         apy = cakePrice
            .times(cakeRewardPerYear)
            .div(new BigNumber(farm.totalLiquidityWithoutPrice).times(cakePrice))
        }
        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.filter(farm => farm.pid < 7).map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethPrice={ethPriceUsd}
          dukePrice = {dukePriceBusd}
          account={account}
        />
      ))
    },
    [bnbPrice, ethPriceUsd, cakePrice, account],
  )

  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="50px" style={{ textAlign: 'center' }}>
        {TranslateString(735, 'Stake LP tokens to earn FAST')}
      </Heading>
      <FarmTabButtons stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} setSpecialOnly={setSpecialOnly} />
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            {stackedOnly ? farmsList(stackedOnlyFarms, false) : farmsList(oldFarms, false)}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsList(inactiveFarms, true)}
          </Route>
        </FlexLayout>
      </div>
    </Page>
  )
}

export default Farms
