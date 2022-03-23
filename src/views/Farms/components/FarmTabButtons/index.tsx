import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Text, Toggle } from '@fastswap-uikit'
import useI18n from 'hooks/useI18n'

const FarmTabButtons = ({ stackedOnly, setStackedOnly, setSpecialOnly }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  const [index, setIndex] = useState(0);
  const handleClick = (newIndex) => setIndex(newIndex);
  
  useEffect(() => {
    if(index === 0){
      setSpecialOnly('all')
    }else if(index === 1){
      setSpecialOnly('duke')
    }else if(index === 2){
      setSpecialOnly('fast')
    }
  }, [index, setSpecialOnly])

  return (
    <Wrapper>
      <ToggleWrapper>
        <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
        <Text> {TranslateString(675, 'Staked only')}</Text>
      </ToggleWrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} variant="primary">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {TranslateString(698, 'Active')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(700, 'Inactive')}
        </ButtonMenuItem>
      </ButtonMenu>
      {/* <div style={{paddingLeft: '24px'}}>
        <ButtonMenu activeIndex={index} onItemClick={handleClick} variant="primary">
          <ButtonMenuItem>
            Old {TranslateString(674, 'Farms')}
          </ButtonMenuItem>
          <ButtonMenuItem>
            DUKE {TranslateString(674, 'Farms')}
          </ButtonMenuItem>
          <ButtonMenuItem>
            FAST {TranslateString(674, 'Farms')}
          </ButtonMenuItem>
        </ButtonMenu>
      </div> */}
      {/* <div style={{paddingLeft: '24px'}}>
        <ToggleWrapper>
          <Toggle checked={dukeOnly} onChange={() => setDukeOnly(!dukeOnly)} />
          <Text> DUKE {TranslateString(674, 'Farms')}</Text>
        </ToggleWrapper>
      </div>
      <div style={{paddingLeft: '24px'}}>
        <ToggleWrapper>
          <Toggle checked={fastOnly} onChange={() => setFastOnly(!fastOnly)} />
          <Text> FAST {TranslateString(674, 'Farms')}</Text>
        </ToggleWrapper>
      </div> */}
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 32px;

  ${Text} {
    margin-left: 8px;
  }
`
