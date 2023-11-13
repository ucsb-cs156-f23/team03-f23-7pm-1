import React from 'react';
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm"
import { ucsbHelpRequestsFixtures } from 'fixtures/ucsbHelpRequestsFixtures';

export default {
    title: 'components/HelpRequests/HelpRequestForm',
    component: HelpRequestForm
};


const Template = (args) => {
    return (
        <HelpRequestForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: ucsbHelpRequestsFixtures.oneHelpRequest,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};
