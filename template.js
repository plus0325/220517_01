// line回覆的卡片模板
export default {
  type: 'bubble',
  hero: {
    type: 'image',
    size: 'full',
    aspectRatio: '5:3',
    url: '',
    aspectMode: 'cover',
    align: 'start',
    animated: true
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        weight: 'bold',
        size: '3xl',
        text: 'Brown Cafe',
        color: '#99BBFF'
      },
      {
        type: 'text',
        text: 'hello, world',
        color: '#99FFFF',
        size: 'lg'
      }
    ],
    backgroundColor: '#003377'
  }
}
