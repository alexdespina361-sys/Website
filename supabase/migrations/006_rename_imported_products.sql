update products
set
  name = case slug
    when 'rafferiza-rochie-eleganta-sexy-cu-decolteu-in-v-si-talie-inalta-tricotata-elasti' then 'Rochie Noire'
    when 'elenzga-rochie-de-dama-cu-maneca-lunga-brodata-cu-decolteu-in-v' then 'Rochie Véra'
    when 'rafferiza-rochie-eleganta-de-lux-pentru-femei-cu-un-umar-din-plasa-cu-aplicatii-' then 'Rochie Aurelia'
    when 'solersun-rochie-maxi-pentru-femei-culoare-solida-simpla-casual-cu-maneca-lunga-d' then 'Rochie Selene'
    when 'eurmuse-rochie-de-petrecere-femeie-negra-cu-paiete-gobat-slim-fit-elegant' then 'Rochie Nuita'
    when 'siren-gaze-rochie-de-dama-din-satin-de-culoare-solida-cu-guler-drapat-cu-volane-' then 'Rochie Époque'
    when 'rafferiza-rochie-de-dama-cu-catarama-metalica-cu-volane' then 'Rochie Volara'
    when 'elenzga-o-rochie-lunga-eleganta-si-romantica-de-toamna-pentru-femei' then 'Rochie Roselle'
    when 'bamgleam-set-2-bucati-la-moda-sexy-cu-imprimeu-leopard-text-in-engleza-cu-talie-' then 'Set Leopara'
    when 'solersun-set-de-2-bucati-pentru-femei-toamna-iarna-design-grafic-cu-imprimeu-con' then 'Set Grafelle'
    when 'aij-set-de-costum-cu-maneca-lunga-minimalist-de-culoare-solida-pentru-femei-amar' then 'Costum Amaré'
    when 'elenzga-rochie-eleganta-sexy-mulata-pentru-femei-pentru-petrecere-de-nunta-cu-ma' then 'Rochie Dentelle'
    when 'elenzga-salopeta-de-dama-cu-dantela-aurie-set-de-2-piese' then 'Salopetă Orlise'
    when 'shein-elenzya-rochie-eleganta-pentru-femei-cu-guler-oblic-maneca-lunga-mulata-cu' then 'Rochie Oblique'
    when 'bamgleam-salopa-sexy-cu-decolteu-asimetric-si-mulata-cu-scobituri-laterale' then 'Salopetă Asymia'
    when 'aij-salopeta-amarilo-verde-inchis-cu-maneca-lunga-talie-incretita-catarama-metal' then 'Salopetă Veloura'
    when 'sandale-cu-toc-inalt-stiletto-cu-varf-ascutit-pentru-femei-de-primavara-vara-cu-' then 'Sandale Verdelle'
    when 'sandale-cu-toc-inalt-decorate-cu-strasuri-potrivite-pentru-tinute-casual-de-zi-c' then 'Sandale Cristelle'
    when 'decor-cu-strasuri-pentru-femei-moda-ademenitoare-sandale-romane-confortabile-cu-' then 'Sandale Romana'
    when 'u-s-polo-assn-slip-de-dama-negru-alb-maro-pachet-de-3' then 'Slip Monarch Trio'
    when 'u-s-polo-assn-slip-negru-pentru-femei-negru-negru-pachet-de-3' then 'Slip Ebony Trio'
    when 'u-s-polo-assn-negru-alb-maro-fucsia-bleumarin-pachet-5-slip-brazilian' then 'Slip Bella Five'
    when 'poseta-de-seara-si-geanta-de-petrecere-cu-paiete-stralucitoare-poseta-de-petrece' then 'Poșetă Lumière'
    when 'set-de-5-bucati-set-de-colier-bratara-inel-si-cercei-elegant-cu-strasuri-pentru-' then 'Set Éclat'
    when 'set-cadou-cu-5-ceasuri-de-dama-bratara-din-otel-roman-auriu-set-de-inele-patrate' then 'Set Aurex'
    when 'bijuterii-cu-diamante-pentru-dama-set-de-bijuterii-cu-diamante-scanteietoare-col' then 'Set Bijoura'
    when 'set-de-bijuterii-cu-strass-colier-bling-cercei-set-de-bratari-pentru-femei-poche' then 'Set Soléa'
    when 'set-de-bijuterii-de-lux-cu-diamante-stralucitoare-colier-cercei-bratara-geanta-p' then 'Set Argenta'
    when '1-set-ceas-compact-cu-cuart-auriu-la-moda-si-bratara-cu-strasuri-cu-inima-aurie-' then 'Ceas Coeur'
    else name
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
