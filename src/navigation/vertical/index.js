const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      path: '/'
    },

    {
      title: 'Master Data',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: 'Admin',
          path: '/apps/admin'
        },
        {
          title: 'User',
          path: '/apps/invoice/preview'
        },
        {
          title: 'Edit',
          path: '/apps/invoice/edit'
        },
        {
          title: 'Add',
          path: '/apps/invoice/add'
        }
      ]
    },
    {
      title: 'Post',
      icon: 'mdi:home-outline'
    }
  ]
}

export default navigation
