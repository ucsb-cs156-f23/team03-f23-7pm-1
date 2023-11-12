import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackendMutation } from "main/utils/useBackend";
import { Navigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({ storybook = false }) {

  const objectToAxiosParams = (review) => ({
    url: "/api/ucsbmenuitemreview/post",
    method: "POST",
    params: {
      itemId: review.itemId,
      stars: review.stars,
      reviewerEmail: review.reviewerEmail,
      dateReviewed: review.dateReviewed,
      comments: review.comments
    }
  });

  const onSuccess = (review) => {
    toast(`New review Created - id: ${review.id} itemId: ${review.itemId} stars: ${review.stars} reviewerEmail: ${review.reviewerEmail} dateReviewed: ${review.dateReviewed} comments: ${review.comments}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsbmenuitemreview/all"] // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New Review</h1>
        <MenuItemReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}