

const ucsbHelpRequestsFixtures = {
    oneHelpRequest: {
        "requesterEmail": "m@gmail.com",
        "teamId": "2",
        "tableOrBreakoutRoom": "t3",
        "requestTime": "2022-01-02T12:00:00"
        , "solved": true
    },
    threeHelpRequests: [
        {
            "requesterEmail": "mr@gmail.com",
            "teamId": "23",
            "tableOrBreakoutRoom": "t34",
            "requestTime": "2023-01-02T12:00:00"
            , "solved": true
        },
        {
            "requesterEmail": "mra@gmail.com",
            "teamId": "234",
            "tableOrBreakoutRoom": "t345",
            "requestTime": "2021-01-02T12:00:00"
            , "solved": false
        },
        {
            "requesterEmail": "mrad@gmail.com",
            "teamId": "234e",
            "tableOrBreakoutRoom": "te345",
            "requestTime": "2020-01-02T12:00:00"
            , "solved": true
        }
    ]
};


export { ucsbHelpRequestsFixtures };