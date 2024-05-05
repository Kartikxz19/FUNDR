// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfunding {
    struct Campaign{
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        //mapping (address=>uint256) donatorID;
        bool active;// signifies whether campaign is active or not
        bool cancel;//signifies whether campaing is cancelled or not.Mainly for investors
    }
    // id =>campaign
    mapping (uint256 => Campaign) public campaigns;
    //investor=>campaign id[]
    mapping (address=> uint256[]) public investedCamps;

    uint256 public numberOfCampaigns = 0;
    receive() external payable{
    }
    function createCampaign(address _owner,string memory _title, string memory _description,uint256 _target,uint256 _deadline,string memory _image) external payable returns(uint256) {
        uint256 security=msg.value;
        require(security==1 ether,"Security Deposit is 1 Ether");
        address payable receiver=payable(address(this));//security deposit
        receiver.transfer(msg.value);
        //create a new campaign(which has to be stored permanently inside the contract => storage type) and assign it inside the compaigns mapping
        Campaign storage c=campaigns[numberOfCampaigns];
        //the deadline given for campaign must be greater than current time
        require(_deadline>=block.timestamp,"The deadline should be a date in the future");
        //assign the values
        c.id=numberOfCampaigns;
        c.owner=_owner;
        c.title=_title;
        c.description=_description;
        c.target=_target;
        c.deadline=_deadline;
        c.amountCollected=0;
        c.image=_image;
        c.active=true;
        c.cancel=false;
        //increment the number of campaigns
        numberOfCampaigns++;
        //transfer fees to contract
        

        return numberOfCampaigns-1;
    }
    
    function donateToCampaign(uint256 _id) public payable {
        
        uint256 amount=msg.value;
        //get out which campaign to transfer funds in
        Campaign storage c = campaigns[_id];
        //CANNOT DONATE YOUR OWN CAMPAIGN
        require(c.owner!=msg.sender,"Cannot donate to your own campaign");
        //if donating more than required, return an error message
        uint256 amountNeeded=c.target-c.amountCollected;
        require(amount<=amountNeeded,"Amount greater than what is required to achieve Target");
        //campaign should be before deadline to be able to donate
        require(c.deadline>=block.timestamp,"Cannot donate, deadline finished");
        require(c.active==true,"Campaign disabled/cancelled");
        address payable receiver=payable(address(this));
        receiver.transfer(msg.value);//paisa saved in contract

        uint256 n=c.donators.length;
        uint256 flag=0;
        for(uint256 i=0;i<n;i++)
        {
            if(c.donators[i]==msg.sender)
            {
                c.donations[i]+=amount;
                flag=1;
                break;
            }
        }
        if(flag==0)
        {
            //add donator to donators array
            c.donators.push(msg.sender);
            //add doation amount to donations array at the same index
            c.donations.push(amount);
            investedCamps[msg.sender].push(_id);//add this campaign to investor's array
        }
        c.amountCollected=c.amountCollected+amount;
    }
    //need array of donators as well as their donations
    function getDonators(uint256 _id) view public returns(address[] memory,uint256[] memory) {
        
        return(campaigns[_id].donators,campaigns[_id].donations);

    }
    function getCampaigns() public view returns(Campaign[] memory) {
        //we have a mapping from id - campaign
        //so we need to create a new array of campaigns
        //similar to dynamic array creation in c/c++
        Campaign[] memory allCampaigns=new Campaign[](numberOfCampaigns);
        for(uint i=0;i<numberOfCampaigns;i++)
        {
            //bring out a campaing from storage
            Campaign storage item=campaigns[i];
            allCampaigns[i]=item;
        }
        return allCampaigns;
    }
    function ownerCampaigns() public view returns(Campaign[] memory) {
        //we have a mapping from id - campaign
        //so we need to create a new array of campaigns
        //similar to dynamic array creation in c/c++
        Campaign[] memory myCampaigns=new Campaign[](0);
        for(uint i=0;i<numberOfCampaigns;i++)
        {
            
            //bring out a campaing from storage
            Campaign storage item=campaigns[i];
            if(item.owner==msg.sender)
            {
                Campaign[] memory tempCampaigns = new Campaign[](myCampaigns.length + 1);
                for (uint256 j = 0; j < myCampaigns.length; j++)
                {
                    tempCampaigns[j] = myCampaigns[j];
                }
                tempCampaigns[myCampaigns.length] = item;
                myCampaigns = tempCampaigns;
            }
        }
        return myCampaigns;
    }
    function investedCampaigns() public view returns(Campaign[] memory) {
        Campaign[] memory myCampaigns=new Campaign[](investedCamps[msg.sender].length);

        for(uint i=0;i<investedCamps[msg.sender].length;i++)
        {
            
            //bring out a campaign from storage
            Campaign storage item=campaigns[investedCamps[msg.sender][i]];
            myCampaigns[i]=item;
        }
        return myCampaigns;
    }
    
    function closeCampaign(uint256 _id) public{
        Campaign storage c = campaigns[_id];
        //you should be the campaign owner to disable it
        require(msg.sender==c.owner,"You are not the owner!");
        require(c.active==true,"Campaign Already closed !");
        //we choose whther the campaign was completed or cancelled.
        if(c.amountCollected==c.target)
        {
            //campaign completed
            c.active=false;
            address payable owner=payable(c.owner);
            (bool success, ) = owner.call{value: c.amountCollected}("");
            require(success, "Transfer to investor failed");
        }
        else{
            //campaign cancelled
            c.cancel=true;
            c.active=false;
        }
    }
    function redeemInvestor(uint256 _id) public payable{
        //investor wants to get his money back
        //investor should have actually invested in this campaign
        Campaign storage c = campaigns[_id];
        require(c.active==false,"Campaign Still active !");
        require(c.cancel==true,"Campaign was not cancelled but completed !");
        uint256 n=c.donators.length;
        uint256 flag=0;
        for(uint256 i=0;i<n;i++)
        {
            if(c.donators[i]==msg.sender)
            {
                flag=1;
                require(c.donations[i]>0,"You have already redeemed your money");
                //give investor money back
                address payable investor=payable(msg.sender);
                (bool success, ) = investor.call{value: c.donations[i]}("");
                require(success, "Transfer to investor failed");
                c.donations[i]=0;
                break;
            }
        }
        require(flag==1,"You never invested in this campaign !");
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    function findCampaigns(address _owner) public view returns(Campaign[] memory){
        Campaign[] memory myCampaigns = new Campaign[](0);
        for(uint256 i=0;i<numberOfCampaigns;i++)
        {
            Campaign storage item=campaigns[i];
            if(item.owner==_owner)
            {
                Campaign[] memory tempCampaigns = new Campaign[](myCampaigns.length + 1);
                for (uint256 j = 0; j < myCampaigns.length; j++)
                {
                    tempCampaigns[j] = myCampaigns[j];
                }
                tempCampaigns[myCampaigns.length] = item;
                myCampaigns = tempCampaigns;
            }
        }
        return myCampaigns;

    }
}
//donation not checked whether donating more than what is required- DONE

//no way to stop a campaign by the campaing creator. Once created ,there should be a way to stop it:-DONE

// revert back the money to users in case of campaign cancel-DONE

//we need to check if the campaign is still active or not. Once, deadline expires, campaign should stop receiving donations.-DONE

//can use which can act as an escrow account that holds money corresponding to each campaign id, till the deadline expires. If campaign cancelled in between, escrow returns money back to donators. If campaign is successful, escrow sends money to campaign creator.If deadline expires before required amount reached, campaign should be rendered cancelled.-DONE

//Cnnot donate yourself- DONE