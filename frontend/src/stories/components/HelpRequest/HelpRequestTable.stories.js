import React from 'react';
//import HelpRequestTable from "main/components/HelpRequests/HelpRequestTable";
import { ucsbHelpRequestsFixtures } from 'fixtures/ucsbHelpRequestsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";
import HelpRequestTable from 'main/components/HelpRequests/HelpRequestTable';

export default {
    title: 'components/HelpRequests/HelpRequestTable',
    component: HelpRequestTable
};

const Template = (args) => {
    return (
        <HelpRequestTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    helprequests: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    helprequests: ucsbHelpRequestsFixtures.threeHelpRequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    helprequests: ucsbHelpRequestsFixtures.threeHelpRequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/helprequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

