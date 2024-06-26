import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { DisplayCampaigns } from "../components";
const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const { address, contract, getActiveCampaigns } = useStateContext();
    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getActiveCampaigns();
        setCampaigns(data);
        setIsLoading(false);
    };
    useEffect(() => {
        if (contract) fetchCampaigns();
    }, [address, contract]);
    return (
        <DisplayCampaigns
            title="All Active Campaigns"
            isLoading={isLoading}
            campaigns={campaigns}
        />
    );
};

export default Home;
