// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        //bool active; signifies whether campaign is active or expired/disabled/cancelled
    }
    // id =>campaign
    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        //create a new campaign(which has to be stored permanently inside the contract => storage type) and assign it inside the compaigns mapping
        Campaign storage c = campaigns[numberOfCampaigns];
        //the deadline given for campaign must be greater than current time
        require(
            _deadline >= block.timestamp,
            "The deadline should be a date in the future"
        );
        //assign the values
        c.owner = _owner;
        c.title = _title;
        c.description = _description;
        c.target = _target;
        c.deadline = _deadline;
        c.amountCollected = 0;
        c.image = _image;
        //increment the number of campaigns
        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }
    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        //get out which campaign to transfer funds in
        Campaign storage c = campaigns[_id];
        //add donator to donators array
        c.donators.push(msg.sender);
        //add doation amount to donations array at the same index
        c.donations.push(amount);
        //send amount to campaign owner. Note: payable returns two values, bool and bytes memory therefore add a ',' after sent
        (bool sent, ) = payable(c.owner).call{value: amount}("");

        if (sent) {
            c.amountCollected = c.amountCollected + amount;
        }
    }
    //need array of donators as well as their donations
    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }
    function getCampaigns() public view returns (Campaign[] memory) {
        //we have a mapping from id - campaign
        //so we need to create a new array of campaigns
        //similar to dynamic array creation in c/c++
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            //bring out a campaing from storage
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
}
