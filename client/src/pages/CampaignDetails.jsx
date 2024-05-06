import React,{useState,useEffect} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';//becoz we need to pass some state to this component from DisplayCampaigns(we passed it via the navigate hook)
import { ethers } from 'ethers';
import { loader } from '../assets';
import { useStateContext } from '../context';
import { CustomButton, CountBox } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';
const CampaignDetails = () => {
  const {state} =useLocation();//got the state from DisplayCampaigns
  const {closeCampaign,getYourMoneyBack,donate,getDonations,contract,address}=useStateContext();//got the context from our global useStateContext
  const [isLoading, setisLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators,setDonators]=useState([]);
  const remainingDays=daysLeft(state.deadline);
  const navigate=useNavigate();
  const fetchDonators=async()=>{
    try{
      const data=await getDonations(state.pId);
      setDonators(data);
    }
    catch(err)
    {
      console.log(err);
    }
    
  }
  useEffect(()=>{
    if(contract)
      fetchDonators();
  },[contract,address]);
  const handleDonate=async()=>{
    setisLoading(true);
    await donate(state.pId,amount);
    setisLoading(false);
    navigate('/');
  }
  const handleRevert=async()=>{
    setisLoading(true);
    await getYourMoneyBack(state.pId);
    setisLoading(false);
    navigate('/');
  }
  const handleCancel=async()=>{
    if(state.owner!==address)
      {
        alert("You are not the owner !");
      }
      else
      {
        setisLoading(true);
        await closeCampaign(state.pId);
        setisLoading(false);
        alert("Campaign Closed !");
        navigate('/');
      }
  }
  return (
    <div>
      {isLoading && <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain"/>}
      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className='w-full h-[410px] object-cover rounded-xl mb-2' />
          
          <div className="relative w-full h-[5px] bg-[#3a3a43] rounded">
            {/* here we show a loading as to how much of the project is completed */}
            <div className="absolute h-full bg-[#4acd8d] rounded" style={{width:`${calculateBarPercentage(state.target,state.amountCollected)}%`,maxWidth:'100%'}}>
            </div>
          </div>
        </div>
      
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays}/>
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected}/>
          <CountBox title="Total Backers" value={donators.length}/>
          
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Creator</h4>
            
            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
              
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className='w-[60%] h-[60%] object-contain'/>
              </div>
              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white break-all '>{state.owner}</h4>
                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>10 campaigns</p>
              </div>
            </div>

          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Story</h4>
            <div className="mt-[20px]">
              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.description}</p>

            </div>  

          </div>     
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Donators</h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length>0? donators.map((item,index)=>(
                <div key={`${item.donator}-${index}`} className='flex justify-between items-center gap-4'>
                  <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all'>{index+1}. {item.donator}</p>
                  <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'>{item.donation} ETH</p>

                </div>
              )) : (
              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No donators yet. Be the first !</p>
              )}

            </div>  

          </div>       

        </div>

        <div className="flex-1 ">

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input type="number" placeholder='ETH 0.1' step="0.01" className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]' value={amount} onChange={(e)=>setAmount(e.target.value)}  />
              <CustomButton btntype="button" title="Fund Campaign" styles={`mt-[10px] w-full bg-[#8c6dfd] text-white opacity-${state.active?100:45} `} active={state.active} handleClick={handleDonate}/>
              <CustomButton btntype="button" title="Revert funds"  styles={`mt-[10px] w-full bg-[#ffff] text-[#000] opacity-${state.active?45:100}`} active={!state.active} handleClick={handleRevert}/>
            </div>
          </div>
        </div>
        <div className="flex-1 ">
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              For the owner
            </p>
            <div className="mt-[30px]">
              <CustomButton btntype="button" title={state.cancel==true?'Already Cancelled':'Cancel Campaign'} styles={`mt-[10px] p-[70px] text-[20px] text-white w-full bg-[#E72929] opacity-${state.active?100:45} `} active={state.active} handleClick={handleCancel}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
