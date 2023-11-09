import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/HelpRequestUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function HelpRequestTable({ help, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/helprequests/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/helprequests/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'requestEmail',
            accessor: 'requestEmail',
        },
        {
            Header: 'teamId',
            accessor: 'teamId',
        },
        {
            Header: 'tableOrBreakoutRoom',
            accessor: 'tableOrBreakoutRoom',
        },
        {
            Header: 'requestTime',
            accessor: 'requestTime',
        },  
        {
            Header: 'name',
            accessor: 'name',
        },  

        {
            Header: 'solved',
            accessor: 'solved',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "HelpRequestTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "HelpRequestTable"));
    } 

    return <OurTable
        data={help}
        columns={columns}
        testid={"HelpRequestTable"}
    />;
};