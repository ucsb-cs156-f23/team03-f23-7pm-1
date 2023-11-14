
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);


    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /restaurants", async () => {

        const queryClient = new QueryClient();
        const review = {
            id: 2,
            itemId: 5,
            stars: 4,
            reviewerEmail: "rd@ucsb.edu",
            dateReviewed: "2022-01-03T00:00:02",
            comments: "Second comment"
        };

        axiosMock.onPost("/api/ucsbmenuitemreview/post").reply(202, review);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Stars")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByLabelText("itemId");
        expect(itemIdInput).toBeInTheDocument();

        const starsInput = screen.getByLabelText("Stars");
        expect(starsInput).toBeInTheDocument();

        const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
        expect(reviewerEmailInput).toBeInTheDocument();

        const dateInput = screen.getByLabelText("Date Reviewed");
        expect(dateInput).toBeInTheDocument();

        const commentsInput = screen.getByLabelText("Comments");
        expect(commentsInput).toBeInTheDocument();


        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: 5 } })
        fireEvent.change(starsInput, { target: { value: 4 } })
        fireEvent.change(reviewerEmailInput, { target: { value: "rd@ucsb.edu" } })
        fireEvent.change(dateInput, { target: { value: "2022-01-03T00:00:02" } })
        fireEvent.change(commentsInput, { target: { value: "Second comment" } })
        


        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: 5,
            stars: 4,
            reviewerEmail: "rd@ucsb.edu",
            dateReviewed: "2022-01-03T00:00:02.000",
            comments: "Second comment"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New review Created - id: 2 itemId: 5 stars: 4 reviewerEmail: rd@ucsb.edu dateReviewed: 2022-01-03T00:00:02 comments: Second comment");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsbmenuitemreview" });

    });

});

