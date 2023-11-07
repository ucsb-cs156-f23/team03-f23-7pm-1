import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticlesForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByText(/Title/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in an Article", async () => {

        render(
            <Router  >
                <ArticlesForm initialContents={articlesFixtures.oneArticle} />
            </Router>
        );
        await screen.findByTestId(/ArticlesForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-title");
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
        fireEvent.change(dateAddedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/DateAdded is required and must be in ISO format/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-submit");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/URL is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateAdded is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-title");

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
        fireEvent.change(dateAddedField, { target: { value: '2023-11-04T17:46:15.228' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        
        expect(screen.queryByText(/Title is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/URL is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/DateAdded is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/DateAdded is required and must be in ISO format/)).not.toBeInTheDocument();

    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });
});