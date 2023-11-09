import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="MenuItemReview-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="itemId">itemId</Form.Label>
                        <Form.Control
                            data-testid="itemId"
                            id="id"
                            type="text"
                            {...register("itemId")}
                            value={initialContents.itemId}
                            disabled
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="stars">Stars</Form.Label>
                        <Form.Control
                            data-testid="stars"
                            id="id"
                            type="text"
                            value={initialContents.stars}
                            {...register("stars", {
                                required: "Stars is required."
                            })}
                            disabled
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                        <Form.Control
                            data-testid="reviewerEmail"
                            id="id"
                            type="text"
                            value={initialContents.reviewerEmail}
                            isInvalid={errors.reviewerEmail}
                            {...register("reviewerEmail", {required: true, pattern: emailRegex})}
                            disabled
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">Date Reviewed</Form.Label>
                        <Form.Control
                            data-testid="dateReviewed"
                            id="dateReviewed"
                            type="datetime-local"
                            isInvalid={Boolean(errors.localDateTime)}
                            {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="comments">Comments</Form.Label>
                <Form.Control
                    data-testid="comments"
                    id="comments"
                    type="text"
                    isInvalid={Boolean(errors.comments)}
                    {...register("Comments", {
                        required: "Comments are required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.comments?.message}
                </Form.Control.Feedback>
            </Form.Group>
            </Row>
            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="MenuItemReview-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="MenuItemReview-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default MenuItemReviewForm;
