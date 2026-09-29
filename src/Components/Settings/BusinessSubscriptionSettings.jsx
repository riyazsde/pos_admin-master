import React, { useState } from 'react';
import './BusinessSubscriptionSettings.css'; // Import the new CSS file
import arrow from '../../assets/Images/Home/arrow.png';

function SubscriptionManagementUI() {
    const [toggleStates, setToggleStates] = useState({
        twoWeeks: true,
        oneWeek: true,
        oneDay: true
    });

    const handleToggle = (key) => {
        setToggleStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSaveChanges = () => {
        // Here you would typically handle the logic for saving the state,
        // for example, by making an API call.
        console.log("Saving changes:", toggleStates);
        alert("Changes Saved!");
    };

    const Toggle = ({ isOn, onToggle }) => (
        <div className="toggle-switch" onClick={onToggle}>
            <div className={`toggle-circle ${isOn ? 'on' : 'off'}`} />
            <div className={`toggle-text on-text ${isOn ? 'visible' : 'hidden'}`}>ON</div>
            <div className={`toggle-text off-text ${!isOn ? 'visible' : 'hidden'}`}>OFF</div>
        </div>
    );

    const plans = [
        { title: 'Monthly', price: '30 XOF' },
        { title: '3 Months', price: '85 XOF' },
        { title: '1 Year', price: '185 XOF' },
    ];

    const renewalOptions = [
        { key: 'twoWeeks', label: '2 weeks ago' },
        { key: 'oneWeek', label: '1 week ago' },
        { key: 'oneDay', label: '1 Day ago' },
    ];

    return (


        <>

           <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-[32px]">
        <span className="text-gray-400 flex items-center gap-5 text-[32px]">
Business Settings          <span className="font-poppins font-bold text-[32px] leading-[120%] tracking-[0%]">
            <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
          </span>
        </span>
Subscription Details      </h1>
        <div className="subscription-management-container">
            <div className="main-content-wrapper">
                {/* Subscription Plans Section */}
                <div className="section">
                    <h2 className="section-title">Subscription Plans</h2>
                    <div className="plans-container">
                        {plans.map((plan) => (
                            <div key={plan.title} className="plan-card">
                                <div className="plan-title-wrapper">
                                    <span className="plan-title">{plan.title}</span>
                                </div>
                                <div className="plan-price-box">
                                    <span className="plan-price">{plan.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscription Renewal Messages Section */}
                <div className="section">
                    <h2 className="section-title">Subscription Renewal Messages</h2>
                    <div className="renewal-options-container">
                        {renewalOptions.map((option) => (
                            <div key={option.key} className="renewal-option-card">
                                <div className="renewal-option-content">
                                    <span className="renewal-option-label">{option.label}</span>
                                    <Toggle
                                        isOn={toggleStates[option.key]}
                                        onToggle={() => handleToggle(option.key)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Renewal Message Section */}
                <div className="section">
                    <h2 className="section-title">Renewal Message</h2>
                    <div className="renewal-message-box">
                        <p className="renewal-message-text">
                            Hey ABC Restaurant, We have an Amazing Renewal Plan for you. The validity of the Offer is going to end in 3 days. Grab it soon before the prices of Subscriptions increases.
                        </p>
                    </div>
                </div>

                {/* Save Changes Button */}
                <div className="save-button-container">
                    <button className="save-changes-btn" onClick={handleSaveChanges}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>

        </>
    );
}

export default SubscriptionManagementUI;