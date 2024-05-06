import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { money, loader } from "../assets";
import { CustomButton, Formfield } from "../components";
import { checkIfImage } from "../utils";
import { useStateContext } from "../context";
const CreateCampaign = () => {
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);
    const { createCampaign } = useStateContext();
    //details of the whole form in this state
    const [form, setform] = useState({
        name: "",
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
    });
    //to handle the form iput
    const handleFromFieldChange = (fieldName, e) => {
        setform({ ...form, [fieldName]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setisLoading(true);
                await createCampaign({
                    ...form,
                    target: ethers.utils.parseUnits(form.target, 18),
                });
                setisLoading(false);
                navigate("/");
            } else {
                alert("Provide valid image URL");
                setform({ ...form, image: "" });
            }
        });

        console.log(form);
    };
    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 ">
            {isLoading && (
                <img
                    src={loader}
                    alt="loader"
                    className="w-[100px] h-[100px] object-contain"
                />
            )}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue  font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                    Start a Campaign
                </h1>
            </div>
            <form
                onSubmit={handleSubmit}
                className="w-full mt-[65px] flex flex-col gap-[30px]"
            >
                <div className="flex flex-wrap gap-[40px]">
                    <Formfield
                        labelName="Your Name"
                        placeholder="Enter your name"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => {
                            handleFromFieldChange("name", e);
                        }}
                    />
                    <Formfield
                        labelName="Campaign Title"
                        placeholder="Enter a Title"
                        inputType="text"
                        value={form.title}
                        handleChange={(e) => {
                            handleFromFieldChange("title", e);
                        }}
                    />
                </div>
                <Formfield
                    labelName="Story*"
                    placeholder="What's Your Story ?"
                    isTextArea={true}
                    value={form.description}
                    handleChange={(e) => {
                        handleFromFieldChange("description", e);
                    }}
                />

                <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
                    <img
                        src={money}
                        alt="money"
                        className="w-[40px] h-[40px] object-contain"
                    />
                    <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
                        You will get 100% of the raised amount !
                    </h4>
                </div>

                <div className="flex flex-wrap gap-[40px]">
                    <Formfield
                        labelName="Goal"
                        placeholder="ETH 0.50"
                        inputType="text"
                        value={form.target}
                        handleChange={(e) => {
                            handleFromFieldChange("target", e);
                        }}
                    />
                    <Formfield
                        labelName="End Date"
                        placeholder="End Date"
                        inputType="date"
                        value={form.deadline}
                        handleChange={(e) => {
                            handleFromFieldChange("deadline", e);
                        }}
                    />
                </div>
                <Formfield
                    labelName="Campaign Image"
                    placeholder="Place image URL"
                    inputType="url"
                    value={form.image}
                    handleChange={(e) => {
                        handleFromFieldChange("image", e);
                    }}
                />
                <div className="flex justify-center items-center mt-[40px]">
                    <CustomButton
                        btntype="submit"
                        title="Submit new Campaign"
                        styles="bg-[#1dc071]"
                    />
                </div>
            </form>
        </div>
    );
};

export default CreateCampaign;
