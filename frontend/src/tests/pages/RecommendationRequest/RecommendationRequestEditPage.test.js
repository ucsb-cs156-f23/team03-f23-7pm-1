import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Recommendation Request");
            expect(screen.queryByTestId("RecommendationRequestForm-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "abc@ucsb.edu",
                professorEmail: "def@ucsb.edu",
                explanation: "UCSB",
                dateRequested: "2022-01-01T12:00",
                dateNeeded: "2023-01-01T12:00",
                done: true
            });
            axiosMock.onPut('/api/recommendationrequests').reply(200, {
                id: "17",
                requesterEmail: "abc@ucsb.edu",
                professorEmail: "def@ucsb.edu",
                explanation: "UCSB",
                dateRequested: "2022-01-01T12:00",
                dateNeeded: "2023-01-01T12:00",
                done: false
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("abc@ucsb.edu");
            expect(professorEmailField).toHaveValue("def@ucsb.edu");
            expect(explanationField).toHaveValue("UCSB");
            expect(dateRequestedField).toHaveValue("2022-01-01T12:00");
            expect(dateNeededField).toHaveValue("2023-01-01T12:00");
            expect(doneField).toBeChecked();

            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("abc@ucsb.edu");
            expect(professorEmailField).toHaveValue("def@ucsb.edu");
            expect(explanationField).toHaveValue("UCSB");
            expect(dateRequestedField).toHaveValue("2022-01-01T12:00");
            expect(dateNeededField).toHaveValue("2023-01-01T12:00");
            expect(doneField).toBeChecked();

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'abc@ucsb.edu' } });
            fireEvent.change(professorEmailField, { target: { value: 'def@ucsb.edu' } });
            fireEvent.change(explanationField, { target: { value: 'UCSB' } });
            fireEvent.change(dateRequestedField, { target: { value: '2022-01-01T12:00' } });
            fireEvent.change(dateNeededField, { target: { value: '2023-01-01T12:00' } });
            fireEvent.click(doneField);

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Recommendation request updated - id: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "abc@ucsb.edu",
                professorEmail: "def@ucsb.edu",
                explanation: "UCSB",
                dateRequested: "2022-01-01T12:00",
                dateNeeded: "2023-01-01T12:00",
                done: false
            })); // posted object

        });


    });
});