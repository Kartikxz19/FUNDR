//store all web3 logic here
import React,{useContext,createContext} from "react";
import { useAddress,useContract,useMetamask,useContractWrite,useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { createThirdwebClient } from "thirdweb";
import { daysLeft } from "../utils";

const StateContext=createContext();
export const StateContextProvider=({children})=>{
    const { contract, isLoading, error }=useContract('0x13516C176764F67eb6bEd34Bd2fF73A90C7a5572');
    //contract.call('createCampaign',[]);
    const {mutateAsync: createCampaign}=useContractWrite(contract,'createCampaign');
    const address=useAddress();
    const connect=useMetamask();

    const publishCampaign=async(form)=>{
        try {
            const data=await createCampaign({args:[
                address,//owner
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image
            ]});
            console.log("contract call success",data);
        } catch (error) {
            console.log("COntract call failure",error);
        }
    }
    const getCampaigns=async()=>{
        const campaigns=await contract.call('getCampaigns');

        //parse the received object into a more readable format
        const parsedCampaigns=campaigns.map((campaign,i)=>(
            {
                owner:campaign.owner,
                title:campaign.title,
                description:campaign.description,
                target:ethers.utils.formatEther(campaign.target.toString()),
                deadline:campaign.deadline.toNumber(),
                amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
                image:campaign.image,
                pId:i
            }
        ))
        const actualCampaigns=parsedCampaigns.filter((ele)=>{
            if(daysLeft(ele.deadline)>0)
                return true;
            else
                return false;
        })
        return actualCampaigns;
    }
    const getUserCampaigns=async()=>{
        const allCampaigns=await getCampaigns();
        //get only those campaigns whose owner==current metamask wallet address
        const filteredCampaigns=allCampaigns.filter((campaign)=>campaign.owner===address);
        return filteredCampaigns;
    }
    const donate=async(pId,amount)=>{
        const data=await contract.call('donateToCampaign',[pId],{value:ethers.utils.parseEther(amount)});
        return data;
    }
    const getDonations=async (pId)=>{
        const donations=await contract.call('getDonators',[pId]);
        console.log(donations);
        const numberOfDonations=donations[0].length;
        const parsedDonations=[];
        for(let i=0;i<numberOfDonations;i++)
        {

            parsedDonations.push({
                donator:donations[0][i],
                donation:ethers.utils.formatEther(donations[1][i].toString())
            });
        }
        console.log(parsedDonations);
        return parsedDonations;
    }
    return (
        <StateContext.Provider 
        value={{
            address,
            contract,
            connect,
            createCampaign:publishCampaign,
            getCampaigns,
            getUserCampaigns,
            getDonations,
            donate,
        }}>
            {children}
        </StateContext.Provider>
    )
}
//create a custom hook
export const useStateContext=()=>useContext(StateContext);
