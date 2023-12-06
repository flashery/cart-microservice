export interface ArchivedServiceOject {
  id: String;
  serviceName: String;
  description: String;
  category: [
    {
      categoryName: String;
      description: String;
      thumbnail: String;
      ancestor: [
        {
          name: String;
          path: String;
        },
        {
          name: String;
          path: String;
        }
      ];
      slug: String;
      path: String;
    }
  ];
}
