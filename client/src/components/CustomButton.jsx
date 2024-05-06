import React from 'react'
import { StateContextProvider } from '../context'

const CustomButton = ({btntype,title,handleClick,styles,active}) => {
  return (
    <button type={btntype} className={`font-epilogue font-semibold text-[16px] leading-[26px]  min-h-[52px] px-4 rounded-[10px] ${styles} ${title!=='Revert funds'?'text-[#fff]':''}`} disabled={(title!=='Create a campaign'&&title!=='Connect'&&title!=='Submit new Campaign')?!active:false} onClick={handleClick}>{title}</button>
  )
}

export default CustomButton
