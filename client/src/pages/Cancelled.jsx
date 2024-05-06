import React,{useState,useEffect} from 'react';
import { useStateContext} from '../context';
import { DisplayCampaigns } from '../components';

const Cancelled = () => {
    const [isLoading,setIsLoading]=useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const {address,contract,getCancelledCampaigns}=useStateContext();
    const fetchCampaigns=async()=>{
      setIsLoading(true);
      const data=await getCancelledCampaigns();
      setCampaigns(data);
      setIsLoading(false);
    }
    useEffect(() => {
      if(contract) fetchCampaigns();
    }, [address,contract]);
    return (
      <DisplayCampaigns
        title="All Closed Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    )
}

export default Cancelled