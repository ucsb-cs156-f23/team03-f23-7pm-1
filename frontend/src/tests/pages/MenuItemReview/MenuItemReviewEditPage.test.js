
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbmenuitemreview", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Review");
            expect(screen.queryByTestId("itemId")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbmenuitemreview", { params: { id: 17 } }).reply(200, {
                id: 2,
                itemId: 5,
                stars: 4,
                reviewerEmail: "rd@ucsb.edu",
                dateReviewed: "2022-01-03T00:00:02",
                comments: "Second comment"
            });
            axiosMock.onPut('/api/ucsbmenuitemreview').reply(200, {
                id: 2,
                itemId: 5,
                stars: 4,
                reviewerEmail: "cgaucho@ucsb.edu",
                dateReviewed: "2022-01-03T00:00:02",
                comments: "some other comment"
            });
        });

        const queryClient = new QueryClient();

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReview-id");

            const idField = screen.getByTestId("MenuItemReview-id");
            const itemIdField = screen.getByTestId("itemId");
            const starsField = screen.getByTestId("stars");
            const reviewerEmailField = screen.getByTestId("reviewerEmail");
            const commentField = screen.getByTestId("comments");
            const submitButton = screen.getByTestId("MenuItemReview-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("2");
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue("5");
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue("4");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(reviewerEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
            fireEvent.change(commentField, { target: { value: 'some other comment' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Review updated - id: 2 itemId: 5 stars: 4 reviewerEmail: cgaucho@ucsb.edu dateReviewed: 2022-01-03T00:00:02 comments: some other comment");

            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbmenuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 2 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: 5,
                stars: 4,
                reviewerEmail: "cgaucho@ucsb.edu",
                dateReviewed: "2022-01-03T00:00:02",
                comments: "some other comment"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReview-id");

            const idField = screen.getByTestId("MenuItemReview-id");
            const itemIdField = screen.getByTestId("itemId");
            const starsField = screen.getByTestId("stars");
            const commentField = screen.getByTestId("comments");
            const submitButton = screen.getByTestId("MenuItemReview-submit");

            expect(idField).toHaveValue("2");
            expect(itemIdField).toHaveValue("5");
            expect(starsField).toHaveValue("4");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(commentField, { target: { value: 'comment' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbmenuitemreview" });

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("2");
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue("5");
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue("4");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(reviewerEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
            fireEvent.change(commentField, { target: { value: 'some other comment' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Review updated - id: 2 itemId: 5 stars: 4 reviewerEmail: cgaucho@ucsb.edu dateReviewed: 2022-01-03T00:00:02 comments: some other comment");

            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbmenuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 2 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: 5,
                stars: 4,
                reviewerEmail: "cgaucho@ucsb.edu",
                dateReviewed: "2022-01-03T00:00:02",
                comments: "some other comment"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReview-id");

            const idField = screen.getByTestId("MenuItemReview-id");
            const itemIdField = screen.getByTestId("itemId");
            const starsField = screen.getByTestId("stars");
            const commentField = screen.getByTestId("comments");
            const submitButton = screen.getByTestId("MenuItemReview-submit");

            expect(idField).toHaveValue("2");
            expect(itemIdField).toHaveValue("5");
            expect(starsField).toHaveValue("4");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(commentField, { target: { value: 'comment' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbmenuitemreview" });
        });


    });
});
