props = {
  fieldMetas: [
    {
      type: 'TEXT_AREA',
      scene: {
        element_props: {},
        validate: ''
      },
      key: 'key123',
    },
    {
      type: 'TEXT',
      scene: {
        element_props: {},
        validate: ''
      },
      key: 'key456',
    },
    {
      type: 'SELECT_MULTIPLE_REMOTE',
      scene: {
        element_props: {},
        validate: ''
      },
      key: 'key777',
    },
    {
      type: 'SELECT',
      scene: {
        element_props: {},
        validate: '',
        related_data: {
          options: [
            {label: 'A', value: 'a'},
            {label: 'B', value: 'b'},
          ]
        }
      },
      key: 'key889',
    },
    {
      type: 'DATE',
      scene: {
        element_props: {
          format: 'yyyy',
          type: 'year'
        },
        validate: '',
        related_data: {}
      },
      key: 'key900',
    },
  ],
  value: {
    key123: '我的 defauult',
    key456: '',
    key777: [{label: '一二三', value: '6666'}]
  }

}
