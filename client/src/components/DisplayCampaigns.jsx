import React from 'react'
import { useNavigate } from 'react-router-dom';
import { loader } from '../assets';
import Fundcard from './Fundcard';
const DisplayCampaigns = ({title,isLoading,campaigns}) => {
  const navigate=useNavigate();
  const handleNavigate=(campaign)=>{
    navigate(`/campaign-details/${campaign.title}`,{state:campaign});
    //displayCampaign will unmount and then navigate to campaign details, thus we cannot pass campaign data as prop to CampaignDetails.
    //Rather, we have to take the help of useNavigate() and pass the campaign data as state to CampaignDetails.
  }
  return (
    <div>
      <h1 className='font-epilogue font-semibold text-[18px] text-white text-left'>{title} ({campaigns.length})</h1>
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading &&(
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain"/>
        )}
        {!isLoading && campaigns.length===0 && (
          <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>
            No campaigns exist !
          </p>
        )}
        {!isLoading && campaigns.length > 0 && campaigns.map((campaign)=>(
          <Fundcard
            key={campaign.id} 
            {...campaign}
            handleClick={()=>handleNavigate(campaign)}
          />
        ))}
      </div>
    </div>
  )
}

export default DisplayCampaigns
