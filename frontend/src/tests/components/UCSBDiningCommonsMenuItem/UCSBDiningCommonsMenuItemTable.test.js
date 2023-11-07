import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBDiningCommonsMenuItemTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Name", "Dining Commons Code", "Station Name"];
  const expectedFields = ["id", "name", "diningCommonsCode", "station"];
  const testId = "UCSBDiningCommonsMenuItemTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable ucsbDiningCommonsMenuItems={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable ucsbDiningCommonsMenuItems={ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Beef Stir Fry");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`)).toHaveTextContent("carillo");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-station`)).toHaveTextContent("Mongolian Grill");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Tres Leches Cake");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-diningCommonsCode`)).toHaveTextContent("de-la-guerra");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-station`)).toHaveTextContent("Bakery");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("Fettucine Alfredo");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-diningCommonsCode`)).toHaveTextContent("portola");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-station`)).toHaveTextContent("The Brick");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable ucsbDiningCommonsMenuItems={ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Beef Stir Fry");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`)).toHaveTextContent("carillo");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-station`)).toHaveTextContent("Mongolian Grill");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Tres Leches Cake");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-diningCommonsCode`)).toHaveTextContent("de-la-guerra");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-station`)).toHaveTextContent("Bakery");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("Fettucine Alfredo");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-diningCommonsCode`)).toHaveTextContent("portola");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-station`)).toHaveTextContent("The Brick");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable ucsbDiningCommonsMenuItems={ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Beef Stir Fry");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`)).toHaveTextContent("carillo");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-station`)).toHaveTextContent("Mongolian Grill");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsbDiningCommonsMenuItems/edit/2'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable ucsbDiningCommonsMenuItems={ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItems} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Beef Stir Fry");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`)).toHaveTextContent("carillo");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-station`)).toHaveTextContent("Mongolian Grill");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});
