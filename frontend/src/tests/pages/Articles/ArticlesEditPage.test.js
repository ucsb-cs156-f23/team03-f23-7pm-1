import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Article");
            expect(screen.queryByTestId("ArticleForm-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "Exploring the Depths of the Mariana Trench",
                url: "www.deepseaexploration.com/mariana_trench",
                explanation: "This article provides an in-depth look at the Mariana Trench, the deepest part of the world's oceans.",
                email: "editor@deepseaexploration.com",
                dateAdded: "2023-11-04T17:46:15.228"
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: "17",
                title: "The Mysteries of Quantum Physics",
                url: "www.quantumphysicsinsights.com/mysteries",
                explanation: "This article delves into the enigmatic world of quantum physics, explaining its fundamental principles in an accessible way.",
                email: "info@quantumphysicsinsights.com", 
                dateAdded: "2023-11-04T17:48:57.000"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-title");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Exploring the Depths of the Mariana Trench");
            expect(urlField).toHaveValue("www.deepseaexploration.com/mariana_trench");
            expect(explanationField).toHaveValue("This article provides an in-depth look at the Mariana Trench, the deepest part of the world's oceans.");
            expect(emailField).toHaveValue("editor@deepseaexploration.com");
            expect(dateAddedField).toHaveValue("2023-11-04T17:46:15.228");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-title");
            
            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");
            
            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Exploring the Depths of the Mariana Trench");
            expect(urlField).toHaveValue("www.deepseaexploration.com/mariana_trench");
            expect(explanationField).toHaveValue("This article provides an in-depth look at the Mariana Trench, the deepest part of the world's oceans.");
            expect(emailField).toHaveValue("editor@deepseaexploration.com");
            expect(dateAddedField).toHaveValue("2023-11-04T17:46:15.228");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'The Mysteries of Quantum Physics' } });
            fireEvent.change(urlField, { target: { value: 'www.quantumphysicsinsights.com/mysteries' } });
            fireEvent.change(explanationField, { target: { value: 'This article delves into the enigmatic world of quantum physics, explaining its fundamental principles in an accessible way.' } });
            fireEvent.change(emailField, { target: { value: 'info@quantumphysicsinsights.com' } });
            fireEvent.change(dateAddedField, { target: { value: '2023-11-04T17:48:57.000' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: The Mysteries of Quantum Physics");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "The Mysteries of Quantum Physics",
                url: "www.quantumphysicsinsights.com/mysteries",
                explanation: "This article delves into the enigmatic world of quantum physics, explaining its fundamental principles in an accessible way.",
                email: "info@quantumphysicsinsights.com", 
                dateAdded: "2023-11-04T17:48:57.000"
            })); // posted object

        });

       
    });
});


