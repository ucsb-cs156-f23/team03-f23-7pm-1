import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
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

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {

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
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbDiningCommonsMenuItem = {
            id: 17,
            name: "Cheese Pizza",
            diningCommonsCode: "carillo",
            station: "Pizza"
        };

        axiosMock.onPost("/api/UCSBDiningCommonsMenuItem/post").reply( 202, ucsbDiningCommonsMenuItem );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("UCSBDiningCommonsMenuItemForm-name")).toBeInTheDocument();
        });

        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(nameField, { target: { value: 'Cheese Pizza' } });
        fireEvent.change(diningCommonsCodeField, { target: { value: 'carillo' } });
        fireEvent.change(stationField, { target: { value: 'Pizza' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "Cheese Pizza",
            "diningCommonsCode": "carillo",
            "station": "Pizza"
        });

        expect(mockToast).toBeCalledWith("New UCSBDiningCommonsMenuItem Created - id: 17 name: Cheese Pizza diningCommonsCode: carillo station: Pizza");
        expect(mockNavigate).toBeCalledWith({ "to": "/diningcommonsmenuitem" });
    });


});


