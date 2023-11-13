
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});


describe("MenuItemReviewIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "MenuItemReviewTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/ucsbmenuitemreview/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Review/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Review/);
        expect(button).toHaveAttribute("href", "/ucsbmenuitemreview/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three reviews correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/ucsbmenuitemreview/all").reply(200, menuItemReviewFixtures.threeReviews);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

        const createReviewButton = screen.queryByText("Create Review");
        expect(createReviewButton).not.toBeInTheDocument();

        const comment = screen.getByText("Second comment");
        expect(comment).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/ucsbmenuitemreview/all").timeout();

        const restoreConsole = mockConsole();


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsbmenuitemreview/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/ucsbmenuitemreview/all").reply(200, ucsbDatesFixtures.threeReviews);
        axiosMock.onDelete("/api/ucsbmenuitemreview").reply(200, "Review with id 1 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Review with id 1 was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbmenuitemreview");
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbmenuitemreview");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    });

});