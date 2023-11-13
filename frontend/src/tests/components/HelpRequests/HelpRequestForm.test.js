import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { ucsbHelpRequestsFixtures } from "fixtures/ucsbHelpRequestsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/requesterEmail/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a HelpRequest", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={ucsbHelpRequestsFixtures.oneHelpRequest} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );

        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const requesterEmail = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamId = screen.getByTestId("HelpRequestForm-team");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        
        const requestTime = screen.getByTestId("HelpRequestForm-requestTime");
        const solved = screen.getByTestId("HelpRequestForm-solved");
        const explanation = screen.getByTestId("HelpRequestForm-explanation");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");
        
        fireEvent.change(requesterEmail, { target: { value: 'm@gmail.com' } });
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 't2' } });
        fireEvent.change(teamId, { target: { value: '2' } });
        fireEvent.change(explanation, { target: { value: 'bad-inp' } });
        fireEvent.change(requestTime, { target: { value: 'bad-input' } });
        fireEvent.change(solved, { target: { value: true} });
        
        fireEvent.click(submitButton);

        await screen.findByText(/requestTime is required and must be in ISO format/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/requesterEmail is required./);
        expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/team is required./)).toBeInTheDocument();
        expect(screen.getByText(/requestTime is required and must be in ISO format/)).toBeInTheDocument();
        expect(screen.getByText(/solved is required./)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const requesterEmail = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamId = screen.getByTestId("HelpRequestForm-team");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        
        const requestTime = screen.getByTestId("HelpRequestForm-requestTime");
        const solved = screen.getByTestId("HelpRequestForm-solved");
        const explanation = screen.getByTestId("HelpRequestForm-explanation");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");
        
        fireEvent.change(requesterEmail, { target: { value: 'm@gmail.com' } });
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 't2' } });
        fireEvent.change(teamId, { target: { value: '2' } });
        fireEvent.change(requestTime, { target: { value: '2023-11-04T17:46:15.228' } });
        fireEvent.change(solved, { target: { value: false} });
        fireEvent.change(explanation, { target: { value: "Syntax issue"} });
        
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        //expect(screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
        expect(screen.queryByText(/requesterEmail is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/tableOrBreakoutRoom is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/teamId is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/requestTime is required and must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/solved is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/explanation is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


