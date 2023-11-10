import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from 'main/components/UCSBOrganization/UCSBOrganizationTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function UCSBOrganizationIndexPage() {

    const currentUser = useCurrentUser();

    const { data: ucsbOrganization, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/ucsborganization/all"],
            { method: "GET", url: "/api/ucsborganization/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/ucsborganization/create"
                    style={{ float: "right" }}
                >
                    Create UCSB Organization
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>UCSBOrganization</h1>
                <UCSBOrganizationTable ucsbOrganizations={ucsbOrganization} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}