import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { DisplayCampaigns } from "../components";
const InvestedCampaigns = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const { address, contract, getInvestedCampaigns } = useStateContext();
    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getInvestedCampaigns();
        console.log(data);
        setCampaigns(data);
        setIsLoading(false);
    };
    useEffect(() => {
        if (contract) fetchCampaigns();
    }, [address, contract]);
    return (
        <DisplayCampaigns
            title="Your Invested Campaigns"
            isLoading={isLoading}
            campaigns={campaigns}
        />
    );
};

export default InvestedCampaigns;
