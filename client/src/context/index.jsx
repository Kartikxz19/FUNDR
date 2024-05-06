//store all web3 logic here
import React,{useContext,createContext} from "react";
import { useAddress,useContract,useMetamask,useContractWrite,useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { createThirdwebClient } from "thirdweb";
import { daysLeft } from "../utils";

const StateContext=createContext();
export const StateContextProvider=({children})=>{
    const { contract, isLoading, error }=useContract('0x4bf0aDB6B37ba0546F14c47d772C5d79b33FE52E');
    //contract.call('createCampaign',[]);
    const {mutateAsync: createCampaign}=useContractWrite(contract,'createCampaign');
    const address=useAddress();
    const connect=useMetamask();
    
    const publishCampaign=async(form)=>{
        try {
            /* const data=await createCampaign({args:[
                address,//owner
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image,
            ],value:0.001}); */
            const data=await contract.call('createCampaign',[address,form.title,form.description,form.target,new Date(form.deadline).getTime(),form.image,],{value:ethers.utils.parseEther('0.001')});
            console.log("contract call success",data);
        } catch (error) {
            console.log("COntract call failure",error);
        }
    }
    const getCampaigns=async()=>{
        const campaigns=await contract.call('getCampaigns');
        //parse the received object into a more readable format
        const parsedCampaigns=campaigns.map((campaign)=>(
            {
                owner:campaign.owner,
                title:campaign.title,
                description:campaign.description,
                target:ethers.utils.formatEther(campaign.target.toString()),
                deadline:campaign.deadline.toNumber(),
                amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
                image:campaign.image,
                active:campaign.active,
                cancel:campaign.cancel,
                pId:campaign.id
            }
        ))
        return parsedCampaigns;
    }
    const getActiveCampaigns=async()=>{
        const campaigns=await contract.call('getCampaigns');
        //parse the received object into a more readable format
        const parsedCampaigns=campaigns.map((campaign)=>(
            {
                owner:campaign.owner,
                title:campaign.title,
                description:campaign.description,
                target:ethers.utils.formatEther(campaign.target.toString()),
                deadline:campaign.deadline.toNumber(),
                amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
                image:campaign.image,
                active:campaign.active,
                cancel:campaign.cancel,
                pId:campaign.id
            }
        ))
        const actualCampaigns=parsedCampaigns.filter((ele)=>{
            if(ele.active===true&&daysLeft(ele.deadline)>0)
                return true;
            else
                return false;
        })
        return actualCampaigns;
    }
    const getCancelledCampaigns=async()=>{
        const campaigns=await getCampaigns();
        
        const deadCampaigns=campaigns.filter((ele)=>{
            if(daysLeft(ele.deadline)<0||ele.active===false)
                return true;
            else
                return false;
        })
        return deadCampaigns;
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
    const getInvestedCampaigns=async ()=>{
        //get the invested campaigns of current user connected via metamask

        const Campaigns=await contract.call('investedCampaigns');
        
        const parsedCampaigns=Campaigns.map((campaign)=>(
            {
                owner:campaign.owner,
                title:campaign.title,
                description:campaign.description,
                target:ethers.utils.formatEther(campaign.target.toString()),
                deadline:campaign.deadline.toNumber(),
                amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
                image:campaign.image,
                active:campaign.active,
                cancel:campaign.cancel,
                pId:campaign.id
            }
        ))
        console.log(parsedCampaigns);
        return parsedCampaigns;
    }
    const closeCampaign=async(campaign_id)=>{
        try {
            await contract.call('closeCampaign',[campaign_id]);
            alert("Campaign Closed !");
        } catch (error) {
            alert(error);
        }
    }
    const searchCampaignsByAddress=async(owner_address)=>{
        const allCampaigns=await getCampaigns();
        const filteredCampaigns=allCampaigns.filter((campaign)=>{
            console.log(campaign.owner,"+",owner_address);
            return campaign.owner===owner_address;
        });
        return filteredCampaigns;
    }
    const getYourMoneyBack=async(campaign_id)=>{
        try {
            await contract.call('redeemInvestor',[campaign_id]);
            alert("Money sent to your account!");
        } catch (error) {
            alert("Either funds already reverted or You never funded this campaign !");
        }
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
            getInvestedCampaigns,
            closeCampaign,
            searchCampaignsByAddress,
            getYourMoneyBack,
            getCancelledCampaigns,
            getActiveCampaigns
        }}>
            {children}
        </StateContext.Provider>
    )
}
//create a custom hook
export const useStateContext=()=>useContext(StateContext);
