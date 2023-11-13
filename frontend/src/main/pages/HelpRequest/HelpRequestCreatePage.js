import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestCreatePage({storybook=false}) {
  // @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
  // @Parameter(name="teamId") @RequestParam String teamId
  // ,
  // @Parameter(name="tableOrBreakoutRoom") @RequestParam String tableOrBreakoutRoom,
  // @Parameter(name="explanation") @RequestParam String explanation,
  // @Parameter(name="solved") @RequestParam boolean solved,
  // @Parameter(name="requestTime", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("requestTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime requestTime)
  const objectToAxiosParams = (helpRequest) => ({
    url: "/api/helprequests/post",
    method: "POST",
    params: {
      requesterEmail: helpRequest.requesterEmail,
      teamId: helpRequest.team,
      requestTime: helpRequest.requestTime,
      solved: helpRequest.solved,
      tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
      explanation: helpRequest.explanation
    }
  });

  const onSuccess = (ucsbDate) => {
    toast(`New helpRequest Created - id: ${ucsbDate.id} teamId: ${ucsbDate.teamId} tableOrBreakoutRoom: ${ucsbDate.tableOrBreakoutRoom} requestTime: ${ucsbDate.solved} solved: ${ucsbDate.requestTime} requesterEmail: ${ucsbDate.requesterEmail} explanation: ${ucsbDate.explanation}` );
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/helprequests/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New HelpRequest</h1>

        <HelpRequestForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}