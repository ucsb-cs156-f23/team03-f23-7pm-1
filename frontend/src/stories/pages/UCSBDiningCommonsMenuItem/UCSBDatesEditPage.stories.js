
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuItemFixtures } from 'fixtures/ucsbDiningCommonsMenuItemFixtures';
import { rest } from "msw";

import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

export default {
    title: 'pages/UCSBDates/UCSBDatesEditPage',
    component: UCSBDatesEditPage
};

const Template = () => <UCSBDiningCommonsMenuItemEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/UCSBDiningCommonsMenuItem', (_req, res, ctx) => {
            return res(ctx.json(ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems[0]));
        }),
        rest.put('/api/UCSBDiningCommonsMenuItem', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



