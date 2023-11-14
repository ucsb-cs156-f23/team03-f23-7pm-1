

const ucsbHelpRequestsFixtures = {
    oneHelpRequest: {
        "id" : 1, 
        "requesterEmail": "m@gmail.com",
        "teamId": "2",
        "tableOrBreakoutRoom": "t3",
        "requestTime": "2022-01-02T12:00:00"
        , "solved": true , "explanation" : "download"
    },
    threeHelpRequests: [
        {
            "id" : 1,
            "requesterEmail": "mr@gmail.com",
            "teamId": "23",
            "tableOrBreakoutRoom": "t34",
            "requestTime": "2023-01-02T12:00:00"
            , "solved": "true", "explanation" : "run-time issue"
        },
        {
            "id" : 2,
            "requesterEmail": "mra@gmail.com",
            "teamId": "234",
            "tableOrBreakoutRoom": "t345",
            "requestTime": "2021-01-02T12:00:00"
            , "solved": "false" , "explanation" : "backend"
        },
        {
            "id" : 3,
            "requesterEmail": "mrad@gmail.com",
            "teamId": "234e",
            "tableOrBreakoutRoom": "te345",
            "requestTime": "2020-01-02T12:00:00"
            , "solved": "true" , "explanation" : "frontend"
        }
    ]
};


export { ucsbHelpRequestsFixtures };