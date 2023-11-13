
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: review, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/ucsbmenuitemreview?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/ucsbmenuitemreview`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (review) => ({
        url: "/api/ucsbmenuitemreview",
        method: "PUT",
        params: {
            id: review.id,
        },
        data: {
            itemId: review.itemId,
            stars: review.stars,
            reviewerEmail: review.reviewerEmail,
            dateReviewed: review.dateReviewed,
            comments: review.comments
              }
    });

    const onSuccess = (review) => {
        toast(`Review updated - id: ${review.id} itemId: ${review.itemId} stars: ${review.stars} reviewerEmail: ${review.reviewerEmail} dateReviewed: ${review.dateReviewed} comments: ${review.comments}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/ucsbmenuitemreview?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/ucsbmenuitemreview" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Review</h1>
                {
                    review && <MenuItemReviewForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={review} />
                }
            </div>
        </BasicLayout>
    )

}