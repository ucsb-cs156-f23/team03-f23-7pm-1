import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function ArticlesCreatePage() {

    const objectToAxiosParams = (article) => ({
        url: "/api/articles/post",
        method: "POST",
        params: {
          title: article.title,
          url: article.url,
          explanation: article.explanation,
          email: article.email,
          dateAdded: article.dateAdded
        }
    });

    const onSuccess = (article) => {
        toast(`New article Created - id: ${article.id} title: ${article.title}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
         { onSuccess }, 
         // Stryker disable next-line all : hard to set up test for caching
         ["/api/articles/all"]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/articles" />
    }

    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Create New Article</h1>

            <ArticlesForm submitAction={onSubmit} />

        </div>
        </BasicLayout>
    )
}
