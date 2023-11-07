import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function UCSBDiningCommonsMenuItemForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    const testIdPrefix = "UCSBDiningCommonsMenuItemForm";

    const validDiningCommonsCodes = ["carillo", "de-la-guerra", "portola", "ortega"];

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-name"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    defaultValue={initialContents ? initialContents.name : ""}
                    {...register("name", {
                        required: "Name is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="diningCommonsCode">Dining Commons Code</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-diningCommonsCode"}
                    id="diningCommonsCode"
                    type="text"
                    isInvalid={Boolean(errors.diningCommonsCode)}
                    defaultValue={initialContents ? initialContents.diningCommonsCode : ""}
                    {...register("diningCommonsCode", {
                        required: "Dining commons code is required.",
                        validate: {
                            validDiningCommonsCode: v => validDiningCommonsCodes.includes(v) || `Invalid dining commons code. Options are: ${validDiningCommonsCodes.join(', ')}`
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.diningCommonsCode?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="station">Station Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-station"}
                    id="station"
                    type="text"
                    isInvalid={Boolean(errors.station)}
                    defaultValue={initialContents ? initialContents.station : ""}
                    {...register("station", {
                        required: "Station name is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.station?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default UCSBDiningCommonsMenuItemForm;