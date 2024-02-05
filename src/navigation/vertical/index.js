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
          title: 'Wilayah',
          path: '/apps/wilayah'
        },
        {
          title: 'Paket',
          path: '/apps/paket'
        }
      ]
    },
    {
      title: 'Post',
      icon: 'mdi-newspaper',
      path: '/apps/post'
    }
  ]
}

export default navigation
