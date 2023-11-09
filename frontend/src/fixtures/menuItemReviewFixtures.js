const menuItemReviewFixtures = {
    oneReview:
    [
      {
       "id": 1,
        "itemId": 4,
        "stars": 3,
        "reviewerEmail": "cgaucho@ucsb.edu",
        "dateReviewed": "2022-01-03T00:00:00",
        "comments": "Some comment"
      }
    ],

    threeReviews:
    [
        {
            "id": 2,
            "itemId": 5,
            "stars": 4,
            "reviewerEmail": "rd@ucsb.edu",
            "dateReviewed": "2022-01-03T00:00:02",
            "comments": "Second comment"
        },

        {
            "id": 3,
            "itemId": 5,
            "stars": 3,
            "reviewerEmail": "someemail@ucsb.edu",
            "dateReviewed": "2022-01-03T00:00:5",
            "comments": "Third comment"
        },

        {
            "id": 4,
            "itemId": 6,
            "stars": 2,
            "reviewerEmail": "something@ucsb.edu",
            "dateReviewed": "2022-01-03T00:03:02",
            "comments": "Fourth comment"
        },
    ]
};

export { menuItemReviewFixtures };