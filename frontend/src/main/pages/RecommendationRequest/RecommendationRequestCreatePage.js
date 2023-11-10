import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (request) => ({
    url: "/api/recommendationrequests/post",
    method: "POST",
    params: {
      requesterEmail: request.requesterEmail,
      professorEmail: request.professorEmail,
      explanation: request.explanation,
      dateRequested: request.dateRequested,
      dateNeeded: request.dateNeeded,
      done: request.done
    }
  });

  const onSuccess = (request) => {
    toast(`New recommendation request created - id: ${request.id}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/recommendationrequests/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequests" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Recommendation Request</h1>

        <RecForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}