/* 中英切换：右上角 EN / 中 按钮。
 * 选择存在 localStorage 'fa-lang'（zh / en）。英文模式下读取 /js/i18n-dict.json（中文原文 → 英文），
 * 把页面上的文字节点和 title/alt/placeholder 换成英文，动态生成的内容（藏品页、图库说明）用 MutationObserver 跟着翻译。
 * 词典里没有的句子按规则处理（日期、价格、【标签】、角色名），还是有中文的就保留原文。
 * 切换语言会刷新页面。 */
(function () {
  var KEY = 'fa-lang';
  var lang = 'zh';
  try { lang = localStorage.getItem(KEY) || 'zh'; } catch (e) {}
  var en = lang === 'en';

  // ---------- 按钮 ----------
  function addButton() {
    var nav = document.querySelector('#navbar .navbar-nav');
    if (!nav || document.getElementById('lang-toggle-btn')) return;
    var li = document.createElement('li');
    li.className = 'nav-item';
    li.id = 'lang-toggle-btn';
    li.setAttribute('data-no-i18n', '');
    li.innerHTML = '<a class="nav-link" href="javascript:;" title="' + (en ? '切换到中文' : 'Switch to English') + '" aria-label="Language">' +
      '<span class="lang-toggle">' + (en ? '中' : 'EN') + '</span></a>';
    li.querySelector('a').addEventListener('click', function () {
      try { localStorage.setItem(KEY, en ? 'zh' : 'en'); } catch (e) {}
      location.reload();
    });
    nav.appendChild(li);
  }

  function reveal() { document.documentElement.classList.remove('fa-i18n-wait'); }

  if (!en) { addButton(); reveal(); return; }
  document.documentElement.lang = 'en';
  addButton();
  setTimeout(reveal, 2500); // 词典加载失败也不要一直白屏

  // ---------- 固定词条（藏品页界面等） ----------
  var UI = {
    '首页': 'Home', '藏品周边': 'Collection', '图库': 'Gallery', '动画原画': 'Anime Cels', '资讯': 'News',
    '知识问答': 'Q&A', '茶话会': 'Tea Party', '茶话会/留言': 'Tea Party / Guestbook', '搜索': 'Search', '关灯': 'Lights off',
    '关键词': 'Keywords', '返回列表': 'Back to list', '加载中…': 'Loading…', '回到顶部': 'Back to top',
    '隐藏 R18 封面': 'Hide R18 covers', '显示 R18 封面': 'Show R18 covers', '全部': 'All',
    '共': 'Total:', '件藏品 · 已收藏': 'items · Owned:', '件': '', '件数': 'Items', '已收藏 / 总数': 'Owned / Total',
    '已收藏': 'Owned', '未收藏': 'Not owned', '珍藏': 'Treasured', '未发售': 'Unreleased',
    '已公布、后来中止发售的商品（不计入藏品总数）': 'Announced but later cancelled (not counted in the total)',
    '点击展开 / 收起': 'Click to expand / collapse', '暂无藏品': 'No items yet',
    '藏品清单加载失败，请刷新重试。': 'Failed to load the collection list. Please refresh and try again.',
    '游戏': 'Games', '手办': 'Figures', '周边': 'Goods', '抱枕/靠垫': 'Dakimakura/Cushions', '海报': 'Posters',
    '宣传单': 'Flyers', '明信片/相卡': 'Postcards/Photo Cards', '电话卡': 'Telephone Cards', 'TCG 卡牌': 'Trading Cards',
    '影音': 'CD & DVD', '书籍': 'Books', '同人制品': 'Doujin', '原画/制作资料': 'Artwork/Materials',
    'Fortune Arterial收藏馆': 'Fortune Arterial Collection', '一站式FA收藏馆': 'The all-in-one FA collection',
    '收藏状态': 'Collection status', '发售日': 'Release date', '商品页': 'Product page', '📝 测评': '📝 Review',
    '博客在允许 JavaScript 运行的环境下浏览效果更佳': 'This site works best with JavaScript enabled',
    '骏河屋分类': 'Suruga-ya category', '骏河屋商品页 ↗': 'Suruga-ya product page ↗',
    '切换到中文': '切换到中文', '上一篇': 'Previous', '下一篇': 'Next', '分类': 'Categories', '标签': 'Tags', '归档': 'Archives',
    '文章': 'Posts', '次': 'times', '本站总访问量': 'Total visits', '本站访客数': 'Visitors', '人次': 'views', '人': 'visitors',
    '评论': 'Comments', '发表评论': 'Post a comment', '未发售 / Unreleased': 'Unreleased', '开灯': 'Lights on', '色纸 红濑桐叶（はるこ）/ ∞Material': 'Shikishi Kiriha Kuze (はるこ) / ∞Material',
    'A4 文件夹 瑛里华（さとうきみあつ）/ あじのり': 'A4 Clear File Erika (さとうきみあつ) / あじのり', 'A4 文件夹 瑛里华（如月みっく）/ PASTEL WING': 'A4 Clear File Erika (如月みっく) / PASTEL WING', '昵称': 'Nickname', '邮箱(可选)': 'Email (optional)', '网址(可选)': 'Website (optional)',
    '预览:': 'Preview:', '表情': 'Emoji', '上传图片': 'Upload image', '预览': 'Preview', '字': 'chars', '登录': 'Log in', '提交': 'Submit',
    '搜索表情包': 'Search stickers', '按正序': 'Oldest', '按倒序': 'Newest', '按热度': 'Popular', '评论': 'Comments', '回复': 'Reply',
    '条评论': 'comments', '加载更多...': 'Load more...', '还没有评论': 'No comments yet', '取消回复': 'Cancel reply', '原画': 'Artwork',
    '千堂瑛里华 1/4 たんぽぽ款': 'Erika Sendo 1/4 Tanpopo ver.', '千堂瑛里华 1/6 たんぽぽ款': 'Erika Sendo 1/6 Tanpopo ver.',
    '红濑桐叶 1/6 たんぽぽ款': 'Kiriha Kuze 1/6 Tanpopo ver.', '东仪白 1/8 コタン堂款': 'Shiro Togi 1/8 Kotando ver.',
    '白（べっかんこう亲笔签名）': 'Shiro (signed by Bekkankou)', '桐叶（べっかんこう亲笔签名）': 'Kiriha (signed by Bekkankou)',
    '奏（べっかんこう亲笔签名）': 'Kanade (signed by Bekkankou)', '14 阳菜（August 20 周年，べっかんこう签名）': '14 Haruna (August 20th anniversary, signed by Bekkankou)',
    '签名色纸 白 べっかんこう绘（C79 套装）': 'Signed Shikishi Shiro, art by Bekkankou (C79 Set)', 'べっかんこう 签名复制原画 X-RATED（2021 新春）': 'Bekkankou Signed Reproduction Art X-RATED (New Year 2021)',
    '白（小说特典，ハーヴェスト出版）': 'Shiro (novel bonus, Harvest Publishing)', 'ChaosTCG 瑛里华 闪卡「学院生活を楽しむ吸血鬼」': 'ChaosTCG Erika Foil Card 「学院生活を楽しむ吸血鬼」',
    '红濑桐叶（はるこ）/ ∞Material': 'Kiriha Kuze (はるこ) / ∞Material', 'A4 瑛里华（さとうきみあつ）/ あじのり': 'A4 Erika (さとうきみあつ) / あじのり',
    'A4 瑛里华（如月みっく）/ PASTEL WING': 'A4 Erika (如月みっく) / PASTEL WING', 'えりりん抱枕套 / PASTEL WING': 'Eririn Dakimakura Cover / PASTEL WING',
    'オーガストバラエティブック（Gamaga）': 'オーガストバラエティブック (Gamaga)'
  };
  // 角色名、常用词（规则翻译用，长的放前面）
  var NAMES = [
    ['千堂瑛里华', 'Erika Sendo'], ['千堂瑛里華', 'Erika Sendo'], ['东仪白', 'Shiro Togi'], ['東儀白', 'Shiro Togi'],
    ['红濑桐叶', 'Kiriha Kuze'], ['紅瀬桐葉', 'Kiriha Kuze'], ['悠木阳菜', 'Haruna Yuki'], ['悠木陽菜', 'Haruna Yuki'],
    ['悠木奏', 'Kanade Yuki'], ['悠木かなで', 'Kanade Yuki'], ['千堂伽耶', 'Kaya Sendo'], ['千堂伊织', 'Iori Sendo'],
    ['支仓孝平', 'Kohei Hasekura'], ['东仪征一郎', 'Seiichiro Togi'], ['八幡平司', 'Tsukasa Hachimantai'],
    ['动画宣发主视觉图', 'Anime Key Visual'], ['全员集合', 'All Characters'], ['女主角', 'Heroines'],
    ['瑛里华', 'Erika'], ['瑛里華', 'Erika'], ['桐叶', 'Kiriha'], ['桐葉', 'Kiriha'], ['阳菜', 'Haruna'], ['陽菜', 'Haruna'],
    ['伽耶', 'Kaya'], ['孝平', 'Kohei'], ['伊织', 'Iori'], ['菲娜', 'Feena'], ['雪丸', 'Yukimaru'], ['奏', 'Kanade'], ['白', 'Shiro'],
    ['细节', 'Detail'], ['线稿', 'Line Art'], ['第六集', 'Episode 6'], ['婚纱', 'Wedding Dress'], ['泳装', 'Swimsuit'],
    ['和服', 'Kimono'], ['制服', 'Uniform'], ['特典', 'bonus'], ['套装', 'Set'], ['景品', 'prize'], ['邮购', 'mail order'],
    ['抽奖', 'lottery'], ['附录', 'supplement'], ['视频截图，待补充', 'video screenshot, to be completed'],
    ['赤之约定', 'Akai Yakusoku'], ['修智馆学院', 'Shuchikan Academy'], ['修智馆', 'Shuchikan'], ['动画版', 'anime ver.'],
    ['款', ' ver.'], ['、', ', '], ['，', ', '], ['：', ': '], ['；', '; '], ['（', ' ('], ['）', ')'], ['／', ' / '], ['＆', ' & '], ['～', '–']
  ];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var CJK = /[぀-ヿ㐀-鿿！-～、。]/;
  var KANA = /[぀-ヿ]/;
  var DICT = {}, TAGS = {}, missing = {};
  window.__faI18nMissing = missing;

  function hasHan(s) { return /[㐀-鿿]/.test(s); }
  function subst(s) {
    for (var i = 0; i < NAMES.length; i++) s = s.split(NAMES[i][0]).join(NAMES[i][1]);
    return s.replace(/\s{2,}/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
  }
  function date(s) {
    var m = s.match(/^(\d{4})年(?:(\d{1,2})月(?:(\d{1,2})日)?)?(上旬|中旬|下旬|末|頃)?$/);
    if (!m) { m = s.match(/^(\d{1,2})月(\d{1,2})日$/); return m ? MONTHS[+m[1] - 1] + ' ' + (+m[2]) : null; }
    var part = { '上旬': 'Early ', '中旬': 'Mid-', '下旬': 'Late ', '末': 'End of ', '頃': 'Around ' }[m[4]] || '';
    if (!m[2]) return part + m[1];
    var mo = MONTHS[+m[2] - 1];
    return m[3] ? mo + ' ' + (+m[3]) + ', ' + m[1] : part + mo + ' ' + m[1];
  }
  function price(s) {
    var m = s.match(/^([\d,]+)日元$/);
    return m ? '¥' + m[1] : null;
  }

  // 返回英文；不需要翻译 / 翻译不了时返回 null
  function tr(s, depth) {
    if (!s || !CJK.test(s)) return null;
    depth = depth || 0;
    if (DICT.hasOwnProperty(s)) return DICT[s];
    if (UI.hasOwnProperty(s)) return UI[s];
    var m, r;
    if (depth > 4) return null;
    // 「：值」形式（单品页的 **标签**：值）
    if ((m = s.match(/^[：:]\s*([\s\S]+)$/))) { r = CJK.test(m[1]) ? tr(m[1], depth + 1) : m[1]; return r == null ? null : ': ' + r.replace(/^:\s*/, ''); }
    if ((r = date(s)) || (r = price(s))) return r;
    // 网页标题：xxx - Fortune Arterial收藏馆
    if ((m = s.match(/^(.+) - (Fortune Arterial收藏馆)$/))) return (tr(m[1], depth + 1) || m[1]) + ' - ' + UI[m[2]];
    // 藏品格子的提示：名字（已收藏） · 珍藏
    if ((m = s.match(/^([\s\S]+?)(（已收藏）|（未收藏）|（开发 \/ 发售中止）)( · 珍藏)?$/))) {
      return (tr(m[1], depth + 1) || m[1]) + ' (' + { '（已收藏）': 'owned', '（未收藏）': 'not owned', '（开发 / 发售中止）': 'development / release cancelled' }[m[2]] + ')' + (m[3] ? ' · Treasured' : '');
    }
    if ((m = s.match(/^(\d+) 件$/))) return m[1];
    if ((m = s.match(/^共计 (\d+) 篇文章$/))) return m[1] + ' posts in total';
    // 官网这一款共有 5 种图案（…），这一格是「瑛里华」。
    if ((m = s.match(/^官网这一款(?:共有 (\d+) 种图案（(.+?)）|有 (.+?) 几种图案)，这一格是「(.+?)」。$/))) {
      var list = subst(m[2] || m[3]);
      return 'This item comes in ' + (m[1] ? m[1] + ' designs (' + list + ')' : 'several designs (' + list + ')') + ' on the official site; this entry is "' + subst(m[4]) + '".';
    }
    // 【标签】名字 / 无括号的「标签 名字」
    if ((m = s.match(/^【([^】]+)】\s*([\s\S]*)$/))) {
      var tag = TAGS[m[1]];
      var rest = m[2] ? (tr(m[2], depth + 1) || (CJK.test(m[2]) ? null : m[2])) : '';
      if (tag && rest != null) return '[' + tag + '] ' + rest;
      if (tag) {
        r = subst(m[2]);
        if (!hasHan(r) && !KANA.test(m[2])) return '[' + tag + '] ' + r;
        missing[m[2]] = (missing[m[2]] || 0) + 1;
        return '[' + tag + '] ' + m[2]; // 剩下的多半是日文书名，保留原文
      }
    }
    if ((m = s.match(/^(\S+) ([\s\S]+)$/)) && DICT['【' + m[1] + '】' + m[2]]) return DICT['【' + m[1] + '】' + m[2]].replace(/^\[([^\]]+)\] /, '$1 ');
    // 全角标点 / 角色名替换后没有汉字了就用替换结果；日文（有假名）的保持原样
    if (!KANA.test(s)) { r = subst(s); if (!hasHan(r)) return r; }
    if (hasHan(s) && !KANA.test(s) && !/^Fortune Arterial收/.test(s)) missing[s] = (missing[s] || 0) + 1;
    return null;
  }

  // ---------- 替换 DOM ----------
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };
  var ATTRS = ['title', 'alt', 'placeholder', 'aria-label', 'data-typed-text'];
  function skipEl(el) {
    for (; el && el.nodeType === 1; el = el.parentNode) {
      if (SKIP[el.tagName] || el.hasAttribute('data-no-i18n')) return true;
    }
    return false;
  }
  function doText(n) {
    var v = n.nodeValue;
    if (!v || !CJK.test(v) || skipEl(n.parentNode)) return;
    var t = v.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    var r = tr(t);
    if (r == null) return;
    var lead = /^\s/.test(v) ? ' ' : '', trail = /\s$/.test(v) ? ' ' : '';
    n.nodeValue = lead + r + trail;
  }
  function doEl(el) {
    if (skipEl(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = el.getAttribute(ATTRS[i]);
      if (a && CJK.test(a)) { var r = tr(a.replace(/\s+/g, ' ').trim()); if (r != null) el.setAttribute(ATTRS[i], r); }
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1 || skipEl(root)) return;
    doEl(root);
    var it = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = it.nextNode())) n.nodeType === 3 ? doText(n) : doEl(n);
  }
  function title() { var r = tr(document.title); if (r != null) document.title = r; }

  function start() {
    walk(document.body); title(); reveal();
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doEl(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    var t = document.querySelector('title');
    if (t) new MutationObserver(title).observe(t, { childList: true });
  }

  fetch('/js/i18n-dict.json').then(function (r) { return r.json(); }).then(function (d) {
    DICT = d;
    // 从词典里「【中文标签】… → [English] …」学出标签对照
    for (var k in d) {
      var a = k.match(/^【([^】]+)】/), b = d[k].match(/^\[([^\]]+)\]/);
      if (a && b && !TAGS[a[1]]) TAGS[a[1]] = b[1];
    }
    var more = {
      '同人本': 'Doujinshi', 'R18': 'R18', '原画': 'Original Art', '分镜': 'Storyboard', '宣传CD': 'Promo CD', '特典': 'Bonus',
      '保护套': 'Case', '食品': 'Food', '杯子': 'Cup', '手机套': 'Phone Case', '钱包': 'Wallet', '钥匙包': 'Key Case',
      '立牌': 'Acrylic Stand', '收纳盒': 'Storage Box', '装饰画': 'Canvas Art', '纸袋': 'Paper Bag', '挂历': 'Calendar',
      '贴纸': 'Sticker', '色纸': 'Shikishi', '书签': 'Bookmark', '帽子': 'Hat', '筷子': 'Chopsticks', '怀表链': 'Watch Chain',
      '手机壳': 'Phone Case', '垫板': 'Pencil Board', '复制原画': 'Reproduction Art', 'QUO卡': 'QUO Card', '数据CD': 'Data CD',
      '语音CD': 'Voice CD', 'BD': 'BD', '歌曲集': 'Song Collection', '演唱会': 'Concert', '钢琴集': 'Piano Album',
      '小说': 'Novel', '小册子': 'Booklet', 'コピー誌': 'Copy Book', '準備号': 'Preview Issue', '悠木かなで/YUKI KANADE': 'Kanade Yuki'
    };
    for (var t in more) if (!TAGS[t]) TAGS[t] = more[t];
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  }).catch(reveal);
})();
