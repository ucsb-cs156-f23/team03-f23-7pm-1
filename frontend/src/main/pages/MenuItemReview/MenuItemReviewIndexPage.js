
import { useBackend } from 'main/utils/useBackend';

import MenuItemReviewTable from 'main/components/MenuItemReview/MenuItemReviewTable';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { hasRole, useCurrentUser } from 'main/utils/currentUser';
import { Button } from 'react-bootstrap';

export default function MenuItemReviewIndexPage() {

    const currentUser = useCurrentUser();

    const { data: reviews, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/ucsbmenuitemreview/all"],
            { method: "GET", url: "/api/ucsbmenuitemreview/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/ucsbmenuitemreview/create"
                    style={{ float: "right" }}
                >
                    Create Review
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Reviews</h1>
                <MenuItemReviewTable reviews={reviews} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}