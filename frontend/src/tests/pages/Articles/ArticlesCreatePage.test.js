import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {

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
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const article = {
            id: 1,
            title: "Exploring the Depths of the Mariana Trench",
            url: "www.deepseaexploration.com/mariana_trench",
            explanation: "This article provides an in-depth look at the Mariana Trench, the deepest part of the world's oceans.",
            email: "editor@deepseaexploration.com",
            dateAdded: "2023-11-04T17:46"
        };

        axiosMock.onPost("/api/articles/post").reply( 202, article );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
        });

        const titleField = screen.getByTestId("ArticlesForm-title");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const explanationField = screen.getByTestId("ArticlesForm-explanation");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(titleField, { target: { value: 'Exploring the Depths of the Mariana Trench' } });
        fireEvent.change(urlField, { target: { value: 'www.deepseaexploration.com/mariana_trench' } });
        fireEvent.change(explanationField, { target: { value: 'This article provides an in-depth look at the Mariana Trench, the deepest part of the world\'s oceans.' } });
        fireEvent.change(emailField, { target: { value: 'editor@deepseaexploration.com' } });
        fireEvent.change(dateAddedField, { target: { value: '2023-11-04T17:46' } });
        fireEvent.click(submitButton);

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(2));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "title": "Exploring the Depths of the Mariana Trench",
            "url": "www.deepseaexploration.com/mariana_trench",
            "explanation": "This article provides an in-depth look at the Mariana Trench, the deepest part of the world's oceans.",
            "email": "editor@deepseaexploration.com",
            "dateAdded": "2023-11-04T17:46"
        });

        expect(mockToast).toBeCalledWith("New article Created - id: 1 title: Exploring the Depths of the Mariana Trench");
        expect(mockNavigate).toBeCalledWith({ "to": "/articles" });
    });

});