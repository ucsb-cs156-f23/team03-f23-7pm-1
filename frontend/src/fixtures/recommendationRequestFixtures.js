const recommendationRequestFixtures = {
    oneRecommendation: {
        "id": 1,
        "requesterEmail": "abc@ucsb.edu",
        "professorEmail": "def@ucsb.edu",
        "explanation": "UCSB",
        "dateRequested": "2022-01-01T11:11:11",
        "dateNeeded": "2023-01-01T00:00:00",
        "done": false
    },
    threeRecomendation: [
        {
            "id": 1,
            "requesterEmail": "abc@ucsb.edu",
            "professorEmail": "def@ucsb.edu",
            "explanation": "BS/MS Program",
            "dateRequested": "2022-01-01T11:11:11",
            "dateNeeded": "2023-01-01T00:00:00",
            "done": false
        },
        {
            "id": 2,
            "requesterEmail": "abc@ucsb.edu",
            "professorEmail": "xyz@ucsb.edu",
            "explanation": "USC",
            "dateRequested": "2023-01-01T11:11:11",
            "dateNeeded": "2024-01-01T00:00:00",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "abc@ucsb.edu",
            "professorEmail": "mnv@ucsb.edu",
            "explanation": "UCB",
            "dateRequested": "2023-01-02T11:11:11",
            "dateNeeded": "2023-05-01T00:00:00",
            "done": false
        }
    ]
};


export { recommendationRequestFixtures };