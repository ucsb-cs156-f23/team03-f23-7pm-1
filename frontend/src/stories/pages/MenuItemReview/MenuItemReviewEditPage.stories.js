import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import { menuItemReviewFixtures } from 'fixtures/menuItemReviewFixtures';
import MenuItemReviewEditPage from 'main/pages/MenuItemReview/MenuItemReviewEditPage';

export default {
    title: 'pages/MenuItemReview/MenuItemReviewEditPage',
    component: MenuItemReviewEditPage
};

const Template = () => <MenuItemReviewEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbmenuitemreview', (_req, res, ctx) => {
            return res(ctx.json(menuItemReviewFixtures.threeReviews[0]));
        }),
        rest.put('/api/ucsbmenuitemreview', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}