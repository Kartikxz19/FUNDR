import React,{useState,useEffect} from 'react'
import { DisplayCampaigns } from '../components'
import { useLocation,useParams} from 'react-router-dom';
import { useStateContext } from '../context';
const CustomCampaigns = () => {
    const {search}=useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading,setIsLoading]=useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const {address,contract,searchCampaignsByAddress}=useStateContext();
    const fetchCampaigns=async()=>{
      setIsLoading(true);
      const data=await searchCampaignsByAddress(searchQuery);
      setCampaigns(data);
      setIsLoading(false);
    }
    useEffect(() => {
      setSearchQuery(search);
      if(contract) fetchCampaigns();
    }, [address,contract,search]);
    return (
      <DisplayCampaigns
        title={`All Campaigns by ${searchQuery}`}
        isLoading={isLoading}
        campaigns={campaigns}
      />
    )
}

export default CustomCampaigns
