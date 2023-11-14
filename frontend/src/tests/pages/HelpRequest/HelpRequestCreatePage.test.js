import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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

describe("HelpRequestsCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
        // @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
        // @Parameter(name="teamId") @RequestParam String teamId
        // ,
        // @Parameter(name="tableOrBreakoutRoom") @RequestParam String tableOrBreakoutRoom,
        // @Parameter(name="explanation") @RequestParam String explanation,
        // @Parameter(name="solved") @RequestParam boolean solved,
        // @Parameter(name="requestTime", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("requestTime")
        const queryClient = new QueryClient();
        const helpRequest = {
            id: 17,
            requesterEmail: "eif@gmail.com",
            teamId: "29",
            tableOrBreakoutRoom: "tab",
            explanation: "compiling",
            solved: "true",
            requestTime: "2022-02-02T00:00"
        };

        axiosMock.onPost("/api/helprequests/post").reply( 202, helpRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-team");
        const requesterTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'eif@gmail.com' } });
        fireEvent.change(teamIdField, { target: { value: "29" } });
        fireEvent.change(requesterTimeField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(explanationField, { target: { value: 'compiling' } });
        fireEvent.change(solvedField, { target: { value: "true" } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: "tab" } });
        
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        console.log("Params" , axiosMock.history.post[0].params);
        expect(axiosMock.history.post[0].params).toEqual(
            {
                requesterEmail: "eif@gmail.com",
                teamId: "29",
                tableOrBreakoutRoom: "tab",
                explanation: "compiling",
                solved: "true",
                requestTime: "2022-02-02T00:00"
            });

        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 17 teamId: 29 tableOrBreakoutRoom: tab requestTime: 2022-02-02T00:00 solved: true requesterEmail: eif@gmail.com explanation: compiling");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
    });


});


