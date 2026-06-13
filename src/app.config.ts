export default defineAppConfig({
  pages: [
    'pages/trends/index',
    'pages/compare/index',
    'pages/favorites/index',
    'pages/alerts/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '娱乐趋势',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8FAFC'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#6366F1',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/trends/index',
        text: '趋势榜'
      },
      {
        pagePath: 'pages/compare/index',
        text: '对比'
      },
      {
        pagePath: 'pages/favorites/index',
        text: '收藏'
      },
      {
        pagePath: 'pages/alerts/index',
        text: '提醒'
      }
    ]
  }
})