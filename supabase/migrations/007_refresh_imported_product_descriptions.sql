update products
set
  description = case slug
    when 'rafferiza-rochie-eleganta-sexy-cu-decolteu-in-v-si-talie-inalta-tricotata-elasti' then 'Rochie neagra cu paiete fine, decolteu in V si talie evidentiata. Silueta elastica o face potrivita pentru petreceri, seri speciale si aparitii elegante.'
    when 'elenzga-rochie-de-dama-cu-maneca-lunga-brodata-cu-decolteu-in-v' then 'Rochie cu maneca lunga, broderie delicata si decolteu in V feminin. O alegere rafinata pentru evenimente unde vrei un look elegant si clar.'
    when 'rafferiza-rochie-eleganta-de-lux-pentru-femei-cu-un-umar-din-plasa-cu-aplicatii-' then 'Rochie de seara cu un umar, plasa fina si accente aurii brodate. Croiala in linie A pastreaza echilibrul dintre spectaculos si sofisticat.'
    when 'solersun-rochie-maxi-pentru-femei-culoare-solida-simpla-casual-cu-maneca-lunga-d' then 'Rochie maxi cu maneca lunga, linie simpla si decupaj discret. Curata vizual si usor de accesorizat pentru seara sau evenimente speciale.'
    when 'eurmuse-rochie-de-petrecere-femeie-negra-cu-paiete-gobat-slim-fit-elegant' then 'Rochie neagra de petrecere, slim fit, cu paiete si stralucire controlata. Contureaza silueta si ramane usor de purtat in aparitii de seara.'
    when 'siren-gaze-rochie-de-dama-din-satin-de-culoare-solida-cu-guler-drapat-cu-volane-' then 'Rochie satinata cu guler drapat, volane si pliuri fine. Are un aer romantic, cu inspiratie vintage, pentru seri elegante si aparitii memorabile.'
    when 'rafferiza-rochie-de-dama-cu-catarama-metalica-cu-volane' then 'Rochie feminina cu volane si accent metalic in talie. Creeaza miscare, defineste silueta si pastreaza o eleganta usor de remarcat.'
    when 'elenzga-o-rochie-lunga-eleganta-si-romantica-de-toamna-pentru-femei' then 'Rochie lunga cu aer romantic si prezenta eleganta. Croiala fluida si linia curata o fac ideala pentru sezonul rece si evenimente speciale.'
    when 'bamgleam-set-2-bucati-la-moda-sexy-cu-imprimeu-leopard-text-in-engleza-cu-talie-' then 'Compleu din doua piese cu imprimeu leopard si talie elastica. Un set statement, gandit pentru aparitii cu energie si impact vizual.'
    when 'solersun-set-de-2-bucati-pentru-femei-toamna-iarna-design-grafic-cu-imprimeu-con' then 'Set din doua piese cu design grafic contrastant si linie moderna. Potrivit pentru tinute urbane, bine definite si usor de remarcat.'
    when 'aij-set-de-costum-cu-maneca-lunga-minimalist-de-culoare-solida-pentru-femei-amar' then 'Costum minimalist cu maneca lunga si croiala curata. O piesa versatila, cu aspect elegant si contemporan, usor de purtat din zi spre seara.'
    when 'elenzga-rochie-eleganta-sexy-mulata-pentru-femei-pentru-petrecere-de-nunta-cu-ma' then 'Rochie mulata cu maneca lunga, guler inalt si insertii de dantela. Gandita pentru evenimente unde vrei un look sofisticat si feminin.'
    when 'elenzga-salopeta-de-dama-cu-dantela-aurie-set-de-2-piese' then 'Salopeta eleganta cu accente de dantela aurie si prezenta rafinata. O alternativa moderna la rochia de seara, cu impact vizual clar.'
    when 'shein-elenzya-rochie-eleganta-pentru-femei-cu-guler-oblic-maneca-lunga-mulata-cu' then 'Rochie cu guler oblic, maneca lunga si talie marcata prin drapaj. Detaliile metalice completeaza un look arhitectural si modern.'
    when 'bamgleam-salopa-sexy-cu-decolteu-asimetric-si-mulata-cu-scobituri-laterale' then 'Salopeta mulata cu decolteu asimetric si decupaje laterale. O piesa indrazneata, construita pentru aparitii de seara cu atitudine.'
    when 'aij-salopeta-amarilo-verde-inchis-cu-maneca-lunga-talie-incretita-catarama-metal' then 'Salopeta din textura catifelata, cu maneca lunga, talie increretita si pantaloni evazati. Pastreaza confortul, dar arata impecabil la evenimente.'
    when 'sandale-cu-toc-inalt-stiletto-cu-varf-ascutit-pentru-femei-de-primavara-vara-cu-' then 'Sandale verzi cu toc stiletto si silueta ascutita. Adauga culoare, inaltime si un accent elegant unei tinute de seara.'
    when 'sandale-cu-toc-inalt-decorate-cu-strasuri-potrivite-pentru-tinute-casual-de-zi-c' then 'Sandale cu toc inalt si strasuri discrete, gandite pentru o aparitie luminoasa. Usor de integrat in tinute festive sau de ocazie.'
    when 'decor-cu-strasuri-pentru-femei-moda-ademenitoare-sandale-romane-confortabile-cu-' then 'Sandale romane cu toc gros, curea la glezna si accente stralucitoare. O alegere stabila si eleganta pentru petreceri, gala sau seara.'
    when 'u-s-polo-assn-slip-de-dama-negru-alb-maro-pachet-de-3' then 'Set de 3 slipuri in nuante clasice, creat pentru confortul de zi cu zi. Croiala practica si paleta versatila le fac usor de purtat.'
    when 'u-s-polo-assn-slip-negru-pentru-femei-negru-negru-pachet-de-3' then 'Set de 3 slipuri negre, simple si curate. Esentiale pentru o selectie de lenjerie discreta si usor de integrat in garderoba.'
    when 'u-s-polo-assn-negru-alb-maro-fucsia-bleumarin-pachet-5-slip-brazilian' then 'Set de 5 slipuri braziliene in culori variate, gandit pentru confort si versatilitate. Un mix usor de folosit zilnic.'
    when 'poseta-de-seara-si-geanta-de-petrecere-cu-paiete-stralucitoare-poseta-de-petrece' then 'Poseta de seara cu paiete stralucitoare si bijuterii asortate. Creata pentru nunti, petreceri si aparitii festive bine puse in valoare.'
    when 'set-de-5-bucati-set-de-colier-bratara-inel-si-cercei-elegant-cu-strasuri-pentru-' then 'Set de bijuterii cu colier, bratara, inel si cercei cu strasuri. Completeaza usor o tinuta eleganta, de zi sau de seara.'
    when 'set-cadou-cu-5-ceasuri-de-dama-bratara-din-otel-roman-auriu-set-de-inele-patrate' then 'Set cadou cu ceas si accesorii aurii, cu accent roman si detalii elegante. Potrivit pentru purtare zilnica sau pentru un cadou memorabil.'
    when 'bijuterii-cu-diamante-pentru-dama-set-de-bijuterii-cu-diamante-scanteietoare-col' then 'Set de bijuterii stralucitoare insotit de geanta eleganta de ocazie. O combinatie completa pentru evenimente, nunti sau petreceri.'
    when 'set-de-bijuterii-cu-strass-colier-bling-cercei-set-de-bratari-pentru-femei-poche' then 'Set cu colier, cercei, bratari si poseta de seara cu stralucire fina. Construit pentru aparitii feminine si festive.'
    when 'set-de-bijuterii-de-lux-cu-diamante-stralucitoare-colier-cercei-bratara-geanta-p' then 'Set luxury cu bijuterii luminoase si geanta plic metalica cu paiete argintii. Un ansamblu statement pentru cocktail, nunta sau gala.'
    when '1-set-ceas-compact-cu-cuart-auriu-la-moda-si-bratara-cu-strasuri-cu-inima-aurie-' then 'Ceas auriu cu bratara decorata cu strasuri si motiv de inima. Un accesoriu delicat, usor de oferit cadou si simplu de integrat zilnic.'
    else description
  end,
  updated_at = now()
where slug in (
  'rafferiza-rochie-eleganta-sexy-cu-decolteu-in-v-si-talie-inalta-tricotata-elasti',
  'elenzga-rochie-de-dama-cu-maneca-lunga-brodata-cu-decolteu-in-v',
  'rafferiza-rochie-eleganta-de-lux-pentru-femei-cu-un-umar-din-plasa-cu-aplicatii-',
  'solersun-rochie-maxi-pentru-femei-culoare-solida-simpla-casual-cu-maneca-lunga-d',
  'eurmuse-rochie-de-petrecere-femeie-negra-cu-paiete-gobat-slim-fit-elegant',
  'siren-gaze-rochie-de-dama-din-satin-de-culoare-solida-cu-guler-drapat-cu-volane-',
  'rafferiza-rochie-de-dama-cu-catarama-metalica-cu-volane',
  'elenzga-o-rochie-lunga-eleganta-si-romantica-de-toamna-pentru-femei',
  'bamgleam-set-2-bucati-la-moda-sexy-cu-imprimeu-leopard-text-in-engleza-cu-talie-',
  'solersun-set-de-2-bucati-pentru-femei-toamna-iarna-design-grafic-cu-imprimeu-con',
  'aij-set-de-costum-cu-maneca-lunga-minimalist-de-culoare-solida-pentru-femei-amar',
  'elenzga-rochie-eleganta-sexy-mulata-pentru-femei-pentru-petrecere-de-nunta-cu-ma',
  'elenzga-salopeta-de-dama-cu-dantela-aurie-set-de-2-piese',
  'shein-elenzya-rochie-eleganta-pentru-femei-cu-guler-oblic-maneca-lunga-mulata-cu',
  'bamgleam-salopa-sexy-cu-decolteu-asimetric-si-mulata-cu-scobituri-laterale',
  'aij-salopeta-amarilo-verde-inchis-cu-maneca-lunga-talie-incretita-catarama-metal',
  'sandale-cu-toc-inalt-stiletto-cu-varf-ascutit-pentru-femei-de-primavara-vara-cu-',
  'sandale-cu-toc-inalt-decorate-cu-strasuri-potrivite-pentru-tinute-casual-de-zi-c',
  'decor-cu-strasuri-pentru-femei-moda-ademenitoare-sandale-romane-confortabile-cu-',
  'u-s-polo-assn-slip-de-dama-negru-alb-maro-pachet-de-3',
  'u-s-polo-assn-slip-negru-pentru-femei-negru-negru-pachet-de-3',
  'u-s-polo-assn-negru-alb-maro-fucsia-bleumarin-pachet-5-slip-brazilian',
  'poseta-de-seara-si-geanta-de-petrecere-cu-paiete-stralucitoare-poseta-de-petrece',
  'set-de-5-bucati-set-de-colier-bratara-inel-si-cercei-elegant-cu-strasuri-pentru-',
  'set-cadou-cu-5-ceasuri-de-dama-bratara-din-otel-roman-auriu-set-de-inele-patrate',
  'bijuterii-cu-diamante-pentru-dama-set-de-bijuterii-cu-diamante-scanteietoare-col',
  'set-de-bijuterii-cu-strass-colier-bling-cercei-set-de-bratari-pentru-femei-poche',
  'set-de-bijuterii-de-lux-cu-diamante-stralucitoare-colier-cercei-bratara-geanta-p',
  '1-set-ceas-compact-cu-cuart-auriu-la-moda-si-bratara-cu-strasuri-cu-inima-aurie-'
);
